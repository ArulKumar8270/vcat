<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Feed;
use App\Models\FeedComment;
use App\Models\FeedLike;
use App\Models\Notification;
use App\Models\User;
use App\Services\FCMService;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;

class InternalFeedController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            // for pagination
            $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
            $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');
            // setting the currentPage into Paginator
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });

            $feeds = Feed::orderBy('id', 'DESC')
                ->with(['getComments' => function ($qry) {
                    $qry->join('users', 'feed_comments.commented_user_id', '=', 'users.id')
                        ->select(
                            'feed_comments.id',
                            'feed_comments.feed_id',
                            'feed_comments.comment',
                            'feed_comments.commented_user_id',
                            'feed_comments.mentioned_users',
                            'feed_comments.created_at',
                            'users.name',
                            'users.image'
                        );
                }, 'getLikes' => function ($qry) {
                    $qry->join('users', 'feed_likes.liked_user_id', '=', 'users.id')
                        ->select('feed_likes.id', 'feed_likes.feed_id', 'feed_likes.liked_user_id', 'feed_likes.feed_name', 'users.name', 'users.image');
                }, 'feedUsers:id,name,image'])
                ->select('feeds.id', 'feeds.user_id', 'feeds.feed_name', 'feeds.feed_paths', 'feeds.discription', 'feeds.created_at', 'feeds.like_count')
                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('feed_name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('discription', 'LIKE', "%{$all['search']}%");
                })
                ->orderBy('feeds.id', 'DESC')->paginate($pageLimit);

            $result = $feeds;
            //$result['feeds'] = $feeds;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result], 200);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function feedStore(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            // $rules = array('discription' => 'max:2000');
            // $Validator = Validator::make($all, $rules);
            // if (!$Validator->passes()) {
            //     return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            // } else {
            $photos = new Feed();
            $photos->user_id = $all['user_id']; //get user id from auth after login
            $photos->feed_paths = $all['filePath'];
            $photos->feed_name = $all['feed_name'];
            $photos->discription = $all['discription'];
            $result = $photos->save();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data insertion done']);
            // }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function feedUpdate(Request $request, $id)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $rules = array('discription' => 'max:2000');
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $photos = Feed::find($id);
                $photos->user_id = $all['user_id']; //get user id from auth after login
                $photos->feed_paths = $all['filePath'];
                $photos->feed_name = $all['feed_name'];
                $photos->discription = $all['discription'];
                $result = $photos->save();
                $result = [];
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $photos]);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function feedShow($id)
    {
        // try
        // {
        $feeds = Feed::find($id);
        $result = [];
        $result['feeds'] = $feeds;
        if ($feeds == null) {
            return Response(['status' => 'error', 'statuscode' => 401, 'result' => 'nothing to show']);
        }
        return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        // }
    }
    public function feedUpload(Request $request)
    {
        try {
            $rules = array(
                'file' => 'mimes:jpeg,jpg,png,gif,mp4,mov,doc,docx,pdf,xlsx,xls|required',
                // 'type' => 'required',
            );

            $Validator = Validator::make($request->all(), $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $result = [];
                $extension = $request->file('file')->extension();
                $fileName = time() . '.' . $extension;
                $filePath = '';
                if ($request['type'] === 'image') {
                    $destinationPath = 'public/storage'; // for server
                    $path = $request->file('file')->move($destinationPath, $fileName);
                    $filePath = 'https://vcat.co.in/staging/vcat-api/public/storage/' . $fileName;
                }
                if ($request['type'] === 'photo_video') {
                    $destinationPath = 'public/storage/feed'; // for server
                    $path = $request->file('file')->move($destinationPath, $fileName);
                    $filePath = 'https://vcat.co.in/staging/vcat-api/public/storage/feed/' . $fileName;
                }
                if ($request['type'] === 'carrier_logo') {
                    $destinationPath = 'public/storage/carrier'; // for server
                    $path = $request->file('file')->move($destinationPath, $fileName);
                    $filePath = 'https://vcat.co.in/staging/vcat-api/public/storage/carrier/' . $fileName;
                }
                if ($request['type'] === 'document_path') {
                    $destinationPath = 'public/storage/document'; // for server
                    $path = $request->file('file')->move($destinationPath, $fileName);
                    $filePath = 'https://vcat.co.in/staging/vcat-api/public/storage/document/' . $fileName;
                }
                if ($request['type'] === 'agenda') {
                    $destinationPath = 'public/storage/events_agenda'; // for server
                    $path = $request->file('file')->move($destinationPath, $fileName);
                    $filePath = 'https://vcat.co.in/staging/vcat-api/public/storage/events_agenda/' . $fileName;
                }
                if ($request['type'] === 'profile') {
                    $destinationPath = 'public/storage/member_profile_images'; // for server
                    $path = $request->file('file')->move($destinationPath, $fileName);
                    $filePath = 'https://vcat.co.in/staging/vcat-api/public/storage/member_profile_images/' . $fileName;
                }
                if ($request['type'] === 'cover_pic') {
                    $destinationPath = 'public/storage/member_cover_pics'; // for server
                    $path = $request->file('file')->move($destinationPath, $fileName);
                    $filePath = 'https://vcat.co.in/staging/vcat-api/public/storage/member_cover_pics/' . $fileName;
                }
                if ($request['type'] === 'wing_image') {
                    $destinationPath = 'public/storage/wings'; // for server
                    $path = $request->file('file')->move($destinationPath, $fileName);
                    $filePath = 'https://vcat.co.in/staging/vcat-api/public/storage/wings/' . $fileName;
                }
                if ($request['type'] === 'resource_docs') {
                    $destinationPath = 'public/storage/resource'; // for server
                    $path = $request->file('file')->move($destinationPath, $fileName);
                    $filePath = 'https://vcat.co.in/staging/vcat-api/public/storage/resource/' . $fileName;
                }

                $result['url'] = $filePath;
                $result['file_name'] = $fileName;

                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function likesIncrement(Request $request)
    {
        // try
        // {
        $all = json_decode($request->getContent(), true);
        $feedID = $all['feed_id'];
        $likedUser = $all['liked_user'];
        $newUser = explode(" ", $likedUser);
        // if ($all['like'] == true) {
        //who is liked post that user data stored and likes increment
        $feed = Feed::where('id', $feedID)->first();
        $allUsers = FeedLike::where('feed_id', $feedID)->select('liked_user_id')->get()->toArray();
        $array = array_column($allUsers, 'liked_user_id');
        $result = array_diff($newUser, $array);
        if (empty($result)) {
            //if $result empty means already liked userdata stored in feedlikes table
            $userData = User::where('id', $likedUser)->first();
            $likedUser = FeedLike::where('liked_user_id', $userData->id)
                ->where('feed_id', $feedID)
                ->first();
            if (!empty($likedUser)) {
                Feed::where('id', $feedID)->decrement('like_count');
                $likedUser->delete();
                $likesCount = Feed::where('id', $feedID)->first();

                $result = [];
                $result['like_count'] = $likesCount->like_count;
                // $notification = Notification::whereIn('send_to', $feed->user_id)->first();

                return Response(['status' => 'success', 'statuscode' => 200, 'post' => 'Disliked', 'result' => $result], 200);
            }
        } else {
            $likes = Feed::where('id', $feedID)->increment('like_count');
            $userData = User::where('id', $likedUser)->first();
            $liked = new FeedLike();
            $liked->liked_user_id = $userData->id;
            $liked->feed_id = $feedID;
            $liked->feed_name = 'Liked';
            $liked->likes = $likes;
            $result = $liked->save();

            if ($feed->user_id == $likedUser) {
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'self liked']);
            }

            $notifications = new Notification();
            $notifications->notification_title = 'Your Post' . $feed->feed_name . ' is liked';
            $notifications->notification_message = $userData->name . " Liked your post";
            $notifications->send_to = '[' . $feed->user_id . ']';
            $notifications->event_reminder_id = 'null';
            $notifications->created_by = $all['liked_user'];
            $notifications->status = $feedID;
            $result = $notifications->save();
            $likeCount = Feed::where('id', $feedID)->select('like_count')->first();
            $user = User::findOrFail($feed->user_id);

            FCMService::send(
                $user->fcm_token,
                [
                    'title' => 'Vcat',
                    'body' => $notifications->notification_message,
                ],
                [
                    'message' => 'Extra Notification Data',
                ],
            );

            $result = [];
            $result['like_count'] = $likeCount->like_count;

            return Response(['status' => 'success', 'statuscode' => 200, 'post' => 'Liked', 'result' => $result], 200);
        }
        // }
        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        // }
    }

    public function feedComment(Request $request)
    {
        // try {
        $all = json_decode($request->getContent(), true);
        $feedID = $all['feed_id'];
        $userID = $all['user_id'];

        $feedData = Feed::where('id', $feedID)->first();
        $userData = User::where('id', $userID)->first();
        $commentedUserDetails = User::where('id', $userID)->select('id', 'name', 'image')->first();

        $comments = new FeedComment();
        $comments['commented_user_id'] = $userData->id;
        $comments['feed_id'] = $feedID;
        $comments['feed_name'] = $feedData->feed_name;
        $comments['comment'] = $all['comment'];
        $comments['mentioned_users'] = !empty($all['mentioned_users']) ? json_encode($all['mentioned_users']) : null;
        // $comments['mentioned_users'] = null;
        $comments_result = $comments->save();
        if (!empty($all['mentioned_users']) && count($all['mentioned_users']) > 0) {
            $mentioned_notifications = new Notification();
            $mentioned_notifications->notification_title = 'You are mentioned in a comment';
            $mentioned_notifications->notification_message = $commentedUserDetails->name . " mentioned you in a comment in " . $userData->name . "'s Post";
            $mentioned_notifications->send_to = json_encode($all['mentioned_users']);
            $mentioned_notifications->event_reminder_id = 'null';
            $mentioned_notifications->created_by = $all['user_id'];
            $mentioned_notifications->status = $feedID;
            $result = $mentioned_notifications->save();
        }
        if ($feedData->user_id == $userID) {
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'self commented']);
        }

        $notifications = new Notification();
        $notifications->notification_title = 'Your Post' . $feedData->feed_name . ' is commented';
        $notifications->notification_message = $commentedUserDetails->name . " commented on your post ";
        $notifications->send_to = '[' . $feedData->user_id . ']';
        $notifications->event_reminder_id = 'null';
        $notifications->created_by = $all['user_id'];
        $notifications->status = $feedID;
        $result = $notifications->save();
        $commentCount = FeedComment::where('commented_user_id', $userID)->count();
        $user = User::findOrFail($feedData->user_id);
        FCMService::send(
            $user->fcm_token,
            [
                'title' => 'Vcat',
                'body' => $notifications->notification_message,
            ],
            [
                'message' => 'Extra Notification Data',
            ],
        );
        $result = [];
        $result['comments_count'] = $commentCount;

        return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);

        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        // }

    }

    public function deleteComment($userID)
    {
        try {
            $deleteComment = FeedComment::where('commented_user_id', $userID)->first();
            $deleteComment->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'comment has been deleted sucess']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
    {
        //
    }

    //posts activity based on login userid
    public function userFeeds(Request $request)
    {

        $all = json_decode($request->getContent(), true);

        $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
        $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');
        // setting the currentPage into Paginator
        Paginator::currentPageResolver(function () use ($currentPage) {
            return $currentPage;
        });
        $result = [];
        $userID = $all['user_id'];
        // $feeds = Feed::where('user_id', $userID)->orderBy('id', 'DESC')
        //     ->get();

        $feeds = Feed::where('user_id', $userID)
            ->with([
                'getComments' => function ($qry) {
                    $qry->join('users', 'feed_comments.commented_user_id', '=', 'users.id')
                        ->select('feed_comments.id', 'feed_comments.feed_id', 'feed_comments.comment', 'feed_comments.commented_user_id', 'users.name', 'users.image');
                }, 'getLikes' => function ($qry) {
                    $qry->join('users', 'feed_likes.liked_user_id', '=', 'users.id')
                        ->select('feed_likes.id', 'feed_likes.feed_id', 'feed_likes.liked_user_id', 'feed_likes.feed_name', 'users.name', 'users.image');
                },
                'feedUsers:id,name,image'
            ])
            ->select('feeds.id', 'feeds.feed_name', 'feeds.user_id', 'feeds.feed_paths', 'feeds.discription', 'feeds.like_count')
            ->orderBy('feeds.id', 'DESC')->paginate($pageLimit);

        // $commentedFeed = FeedComment::where('commented_user_id', $userID)->select('feed_id')->get()->toArray();
        // $likedFeed = FeedLike::where('liked_user_id', $userID)->select('feed_id')->get()->toArray();
        // $feedsLike = Feed::whereIn('id', $likedFeed)->get()->toArray();
        // $feedsComment = Feed::whereIn('id', $commentedFeed)->get()->toArray();

        $result = $feeds;
        // $result['liked_feeds'] = $feedsLike;
        // $result['commented_feeds'] = $feedsComment;

        return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result], 200);
    }

    public function Activity(Request $request)
    {

        $all = json_decode($request->getContent(), true);

        $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
        $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');
        // setting the currentPage into Paginator
        Paginator::currentPageResolver(function () use ($currentPage) {
            return $currentPage;
        });
        $userID = $all['user_id'];
        $commentedFeed = FeedComment::where('commented_user_id', $userID)->select('feed_id')->orderBy('id', 'DESC')->get()->toArray();
        $likedFeed = FeedLike::where('liked_user_id', $userID)->select('feed_id')->orderBy('id', 'DESC')->get()->toArray();

        // $recentComments = FeedComment::orderBy('id', 'DESC')->get();
        // $recentLikes = FeedLike::orderBy('id', 'DESC')->get();

        $c = array_merge($commentedFeed, $likedFeed);
        $feeds = Feed::whereIn('id', $c)
            ->with(['getComments' => function ($qry) {
                $qry->join('users', 'feed_comments.commented_user_id', '=', 'users.id')
                    ->select('feed_comments.id', 'feed_comments.feed_id', 'feed_comments.comment', 'feed_comments.created_at', 'feed_comments.commented_user_id', 'users.name', 'users.image')->orderBy('feed_comments.id', 'DESC');
            }, 'getLikes' => function ($qry) {
                $qry->join('users', 'feed_likes.liked_user_id', '=', 'users.id')
                    ->select('feed_likes.id', 'feed_likes.feed_id', 'feed_likes.liked_user_id', 'feed_likes.feed_name', 'users.name', 'users.image')->orderBy('feed_likes.id', 'DESC');
            }, 'feedUsers:id,name,image'])
            ->select('feeds.id', 'feeds.user_id', 'feeds.feed_name', 'feeds.feed_paths', 'feeds.discription', 'feeds.created_at', 'feeds.like_count')
            ->orderBy('feeds.id', 'DESC')->paginate($pageLimit);

        $result = $feeds;

        // $result = [];
        // $result['comments_count'] = $feeds;
        // $result['recent_comments'] = $recentComments;
        // $result['recent_likes'] = $recentLikes;

        return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result], 200);
    }

    // public function notificationFeed(Request $request)
    // {
    //     $feedID = $all['feed_id'];
    // }
    public function singleFeed(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $feedID = $all['feed_id'];
            $feeds = Feed::where('id', $feedID)
                ->with([
                    'getComments' => function ($qry) {
                        $qry->join('users', 'feed_comments.commented_user_id', '=', 'users.id')
                            ->select('feed_comments.id', 'feed_comments.feed_id', 'feed_comments.comment', 'feed_comments.created_at', 'feed_comments.commented_user_id', 'users.name', 'users.image');
                    }, 'getLikes' => function ($qry) {
                        $qry->join('users', 'feed_likes.liked_user_id', '=', 'users.id')
                            ->select('feed_likes.id', 'feed_likes.feed_id', 'feed_likes.liked_user_id', 'feed_likes.feed_name', 'users.name', 'users.image');
                    },
                    'feedUsers:id,name,image'
                ])
                ->select('feeds.id', 'feeds.feed_name', 'feeds.user_id', 'feeds.feed_paths', 'feeds.discription', 'feeds.like_count')
                ->orderBy('feeds.id', 'DESC')->get();

            $result = $feeds;
            if (!empty($result)) {
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result], 200);
            } else {
                return Response(['status' => 'error', 'statuscode' => 401, 'result' => "This post is no longer available."], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function deleteFeed($id)
    {
        try {
            $feeds = Feed::find($id);
            $feeds->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'Your post is deleted']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
