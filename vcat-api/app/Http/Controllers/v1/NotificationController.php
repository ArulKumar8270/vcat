<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Feed;
use App\Models\Notification;
use App\Models\User;
use App\Models\WingMember;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    //getting all notification from notification table based on user_id

    public function notificationList(Request $request)
    {

        $all = json_decode($request->getContent(), true);
        $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
        $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');
        Paginator::currentPageResolver(function () use ($currentPage) {
            return $currentPage;
        });
        $notifications = Notification::when(!empty($all['user_id']), function ($query) use ($all) {
            return $query->whereJsonContains('send_to', $all['user_id'])
                ->orWhereJsonContains('readed_user', $all['user_id']);
        })
            ->join('users', 'notifications.created_by', '=', 'users.id')
            ->select('notifications.notification_message', 'notifications.send_to', 'notifications.readed_user', 'notifications.status', 'notifications.id', 'notifications.updated_at', 'notifications.created_at', 'notifications.notification_title', 'notifications.created_by', 'users.name', 'users.image')->orderBy('updated_at', 'DESC');

        $notificationCount = Notification::when(!empty($all['user_id']), function ($query) use ($all) {
            return $query->orWhereJsonContains('send_to', $all['user_id']);
        })
            ->count();

        $notifications = $notifications->paginate($pageLimit)->toArray();
        $readedCount = 0;
        $unreadedCount = 0;
        if (count($notifications['data']) > 0) {
            $notificationList = [];
            $data = $notifications['data'];
            foreach ($data as $key => $value) {
                $notification = $value;
                $readedUser = json_decode($value['readed_user']);
                $status = 0;
                if (!empty($readedUser) && in_array($all['user_id'], $readedUser)) {
                    $status = 1;
                    $readedCount++;
                }
                $notification['status'] = $status;
                array_push($notificationList, $notification);
            }
            $notifications['data'] = $notificationList;
            $unreadedCount = count($notifications['data']) - $readedCount;
        }
        $result = [];
        $result['unreadedCount'] = $unreadedCount;
        $result['notificationCount'] = $notificationCount;
        $result['Notifications'] = $notifications;

        return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
    }

    public function reminderNotification(Request $request)
    {

        $all = json_decode($request->getContent(), true);
        $addDate = Carbon::now()->addDay();
        $newDateTime = Carbon::now()->subDay();
        $reminderEvent = Event::whereBetween('from_date', [$newDateTime, $addDate])->get()->toArray();

        if (!empty($reminderEvent)) {
            $eventDetails = Event::whereBetween('from_date', [$newDateTime, $addDate])->select('name', 'venue', 'from_date', 'to_date', 'id', 'wings', 'members')->first();
            // dd($eventDetails->id);
            $array = json_decode(json_decode(json_encode($eventDetails->wings)), true);
            $wingMembers = WingMember::whereIn('wing_id', $array)->select('members')->get()->toArray(); //type array
            $member = [];
            if (!empty($wingMembers)) {
                foreach ($wingMembers as $wingMember) {
                    $userIds = json_decode($wingMember['members'], true);
                    foreach ($userIds as $ids) {
                        array_push($member, $ids);
                    }
                }
                $new = json_decode(json_decode(json_encode($eventDetails->members)), true);
                foreach ($new as $id) {
                    array_push($member, $id);
                }
            }
            $result = array_unique($member);
            sort($result, SORT_NUMERIC);
            $notificationDetails = Notification::where('event_reminder_id', $eventDetails->id)->first();
            if ($notificationDetails == null) {
                $notifications = new Notification();
                $notifications->notification_title = 'Event reminder' . $eventDetails->name . ' created';
                $notifications->notification_message = 'we have evnt ' . date('D M-Y', strtotime($eventDetails->from_date)) . " at " . $eventDetails->venue . "please alert";
                $notifications->send_to = json_encode($result);
                $notifications->event_reminder_id = $eventDetails->id;
                $notifications->created_by = $all['user_id'];
                $result = $notifications->save();
            } else {
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'reminder created already']);

            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'event reminder created sucessfully']);

        } else {
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'sorry nothing to view']);
        }

    }
    public function readedNotification(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $notification_id = $all['notification_id'];
            $readedUsers = Notification::where('id', $notification_id)->select('readed_user')->get()->toArray();
            $FeedID = Notification::where('id', $notification_id)->select('status')->get();

            $member = [];
            $singleUser = array($all['user_id']);
            if (!empty($readedUsers)) {
                foreach ($readedUsers as $readedUser) {
                    $userIds = json_decode($readedUser['readed_user'], true);
                    if ($userIds == null) {
                        foreach ($singleUser as $id) {
                            array_push($member, $id);
                        }
                    } else {
                        foreach ($userIds as $user) {
                            array_push($member, $user);
                            $stored = array_intersect($singleUser, $userIds);
                        }
                        if (!empty($stored)) {
                            return Response(['status' => 'success', 'statuscode' => 401, 'message' => 'already viewed notification', 'result' => $FeedID], 401);
                        } else {
                            foreach ($singleUser as $id) {
                                array_push($member, $id);
                            }
                        }
                    }
                }
                $result = Notification::where('id', $notification_id)->update(['readed_user' => $member]);

                return Response(['status' => 'success', 'statuscode' => 200, 'message' => 'one notification readed', 'result' => $FeedID], 200);
            }
            return Response(['status' => 'success', 'statuscode' => 401, 'message' => 'your readed all notification one by one :)-', 'result' => $FeedID], 402);

        } catch (\Exception$e) {
            return Response([
                'status' => 'error',
                'statuscode' => 500,
                'result' => "error " . $e->getMessage(),
            ], 500);
        }
    }
    public function readAll(Request $request)
    {
        // try {
        $all = json_decode($request->getContent(), true);
        $notification_id = $all['notification_id'];
        $readedUsers = Notification::whereIn('id', $notification_id)->select('readed_user', 'id')->get()->toArray();
        $singleUser = array($all['user_id']);
        if (!empty($readedUsers)) {
            foreach ($readedUsers as $readedUser) {
                $userIds = json_decode($readedUser['readed_user'], true);
                if ($userIds == null) {
                    $userIdString = array_push($singleUser);
                } else {
                    array_push($userIds, $all['user_id']);
                    $userIdString = $userIds;
                    $result = array_unique($userIdString);
                }
                sort($result, SORT_NUMERIC);
                Notification::where('id', $readedUser['id'])->update(['readed_user' => $result]);
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'all notification readed'], 200);

        }
        return Response(['status' => 'success', 'statuscode' => 401, 'result' => 'sorry nothing to read'], 401);
        // } catch (\Exception$e) {
        //     return Response([
        //         'status' => 'error',
        //         'statuscode' => 500,
        //         'result' => "error " . $e->getMessage(),
        //     ], 500);
        // }
    }
    public function clearAll(Request $request)
    {
        // try {
        $all = json_decode($request->getContent(), true);
        $notificationId = $all['notification_id'];
        $notifications = Notification::when(!empty($all['notification_id']), function ($query) use ($notificationId) {
            return $query->whereIn('id', $notificationId);
        })
            ->select('send_to', 'readed_user', 'id')->get()->toArray();
        if (!empty($notifications)) {
            foreach ($notifications as $notification) {
                $userIds = json_decode($notification['send_to'], true);
                $readedIds = json_decode($notification['readed_user'], true);
                if (!empty($userIds)) {
                    if (in_array($all['user_id'], $userIds)) {
                        $key = array_search($all['user_id'], $userIds);
                        unset($userIds[$key]);
                        $json = json_encode(array_values($userIds), true);
                        Notification::where('id', $notification['id'])->update(['send_to' => $json]);
                    }
                }
                if (!empty($readedIds)) {
                    if (in_array($all['user_id'], $readedIds)) {
                        $readed = array_search($all['user_id'], $readedIds);
                        unset($readedIds[$readed]);
                        $data = json_encode(array_values($readedIds), true);
                        Notification::where('id', $notification['id'])->update(['readed_user' => $data]);

                    }
                }
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'both clear'], 200);
        }
        return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'sorry nothing to clear'], 401);
        // } catch (\Exception$e) {
        //     return Response([
        //         'status' => 'error',
        //         'statuscode' => 500,
        //         'result' => "error " . $e->getMessage(),
        //     ], 500);
        // }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $rules = array(
                'notification_title' => 'required|string',
                'notification_message' => 'required|string',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $notifications = new Notification();
                $notifications->notification_title = $all['notification_title'];
                $notifications->notification_message = $all['notification_message'];
                $notifications->send_to = json_encode($all['send_to']);
                $notifications->created_by = $all['user_id'];
                $result = $notifications->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'inserted.']);
            }
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try
        {
            $notifications = Notification::find($id);
            $result = [];
            $result['notifications'] = $notifications;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function showAll()
    {
        {
            try
            {
                $result = Notification::get();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
            } catch (\Exception$e) {
                return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
            }
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $all = json_decode($request->getContent(), true);

            $rules = array(
                'notification_title' => 'required|string',
                'notification_message' => 'required|string',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $notifications = Notification::find($id);
                $notifications->notification_title = $all['notification_title'];
                $notifications->notification_message = $all['notification_message'];
                $notifications->send_to = $all['send_to'];
                $notifications->modified_by = $all['user_id'];
                $result = $notifications->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'updated done..']);
            }
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try
        {
            $notifications = Notification::find($id);
            $notifications->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function sendSmsNotificaition()
    {
        // $basic  = new \Nexmo\Client\Credentials\Basic('Nexmo key', 'Nexmo secret');
        // $client = new \Nexmo\Client($basic);
        $basic = new \Vonage\Client\Credentials\Basic("1cc2f0dd", "FiGfj2lKbSRZnxVB");
        $client = new \Vonage\Client($basic);
        // $response = $client->sms()->send(
        //     new \Vonage\SMS\Message\SMS("919440466137", 'vcat', 'hi satish iam nag')
        // );

        // $message = $response->current();

        // if ($message->getStatus() == 0) {
        //     echo "The message was sent successfully\n";
        // } else {
        //     echo "The message failed with status: " . $message->getStatus() . "\n";
        // }
        $message = $client->message()->send([
            'to' => '919440466137',
            'from' => 'John Doe',
            'text' => 'A simple hello message sent from Vonage SMS API final test',
        ]);

        dd('SMS message has been delivered.');
    }
    public function shareNotification(Request $request)
    {
        $all = json_decode($request->getContent(), true);
        $feedID = $all['feed_id'];
        $userID = $all['user_id'];
        $feedUser = Feed::where('id', $feedID)->select('id', 'feed_name', 'user_id')->first();
        $FeedUserDetails = User::where('id', $feedUser->user_id)->select('id', 'name', 'image')->first();
        $sharedUserDetails = User::where('id', $userID)->select('id', 'name', 'image')->first();
        $notifications = new Notification();
        $notifications->notification_title = 'Your Post' . $feedUser->feed_name . ' is shared';
        $notifications->notification_message = 'Dear ' . $FeedUserDetails->name . " your post shared by " . $sharedUserDetails->name;
        $notifications->send_to = '[' . $FeedUserDetails->id . ']';
        $notifications->event_reminder_id = 'null';
        $notifications->created_by = $all['user_id'];
        $notifications->status = $feedID;

        $result = $notifications->save();
        $result = [];
        $result['notifications'] = $notifications;
        return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result], 200);
    }

    public function CommentNotification(Request $request)
    {
        $all = json_decode($request->getContent(), true);
        $feedID = $all['feed_id'];
        $userID = $all['user_id'];
        $feedUser = Feed::where('id', $feedID)->select('id', 'feed_name', 'user_id')->first();
        $FeedUserDetails = User::where('id', $feedUser->user_id)->select('id', 'name', 'image')->first();
        $sharedUserDetails = User::where('id', $userID)->select('id', 'name', 'image')->first();
        $notifications = new Notification();
        $notifications->notification_title = 'Your Post' . $feedUser->feed_name . ' is shared';
        $notifications->notification_message = 'Dear ' . $FeedUserDetails->name . " your post shared by " . $sharedUserDetails->name;
        $notifications->send_to = '[' . $FeedUserDetails->id . ']';
        $notifications->event_reminder_id = 'null';
        $notifications->created_by = $all['user_id'];
        $notifications->status = $feedID;

        $result = $notifications->save();
        $result = [];
        $result['notifications'] = $notifications;
        return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result], 200);
    }
}
