<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Event;
use App\Models\Page;
use App\Models\User;
use App\Models\Wing;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //$all = json_decode($request->getContent(), true);

        try {
            $all = json_decode($request->getContent(), true);
            $pageInfo = DB::select("SELECT * FROM pages p WHERE p.page LIKE '".$all['page']."%'");
            $bannerData = DB::select("SELECT * FROM banners b WHERE b.page LIKE '".$all['page']."%'");
            // $pageInfo = Page::where('page', 'like', "{$all['page']}%")
            //     ->get();
            // $bannerData = Banner::where('page', 'like', "{$all['page']}%")
            //     ->get();

            // for pagination
            $currentPage = !empty($all['currentPage']) ? $all['currentPage'] : 1;
            $pageLimit = !empty($all['size']) ? $all['size'] : 3;

            // setting the currentPage into Paginator
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });

            $result = [];
            $result['pageInfo'] = $pageInfo;
            $result['bannerData'] = $bannerData;

            switch ($all['page']) {
                case "home":
                    //for upcoming events
                    $eventHoster = Event::where('status', 0)->whereDate('from_date', '>=', date('Y-m-d'))->limit(3)->get()->toArray();
                    $eventInfo = [];
                    foreach ($eventHoster as $key => $event) {
                        $eventInfo[$key] = $event;
                        $hostedBy = json_decode($event['hosted_by'], true);
                        $eveHostDetails = [];
                        if (!empty($hostedBy[0])) {
                            $eveHostDetails = User::where('id', $hostedBy[0])->first();
                        }
                        $eventInfo[$key]['user'] = $eveHostDetails;
                    }
                    $result['upcoming_events'] = $eventInfo;
                    break;
                case "about_us":
                    $userData = User::orderBy('id', 'DESC')->limit('8')->get();
                    $result['userData'] = $userData;
                    break;
                case "wings":
                    $wings = Wing::get();
                    $result['wings'] = $wings;
                    break;
                case "events":
                    //for upcoming events
                    $eventHoster = Event::where('status', 0)->whereDate('from_date', '>=', date('Y-m-d'))->limit(3)->get()->toArray();
                    $eventInfo = [];
                    foreach ($eventHoster as $key => $event) {
                        $eventInfo[$key] = $event;
                        $hostedBy = json_decode($event['hosted_by'], true);
                        // dd($hostedBy);
                        $eveHostDetails = [];
                        if (!empty($hostedBy[0])) {
                            $eveHostDetails = User::where('id', $hostedBy[0])->first();
                        }
                        $eventInfo[$key]['user'] = $eveHostDetails;
                    }
                    //for all events
                    $events = Event::orderBy('id', 'DESC')->whereDate('from_date', '<', date('Y-m-d'))->paginate($pageLimit);
                    foreach ($events as $key => $event) {
                        $eventHost[$key] = $event;
                        $hostedBy = json_decode($event['hosted_by'], true);
                        // dd($hostedBy);
                        $eveHostDetails = [];
                        if (!empty($hostedBy[0])) {
                            $eveHostDetails = User::where('id', $hostedBy[0])->first();
                        }
                        $eventHost[$key]['user'] = $eveHostDetails;
                    }
                    $result['eventsPage'] = $events;
                    $result['upcoming_events'] = $eventInfo;

                    break;
                case "resources":
                    //in resources complted evets list (means old events)
                    $oldEvents = Event::where('status', 0)->whereDate('from_date', '<', date('Y-m-d'))
                        ->when(!empty($all['search']), function ($query) use ($all) {
                            return $query->where('name', 'LIKE', "%{$all['search']}%")
                                ->orWhere('description', 'LIKE', "%{$all['search']}%")
                                ->orWhere('topic', 'LIKE', "%{$all['search']}%");
                        })
                        ->orderBy('id', 'DESC')->get()->toArray();
                    $eventInfo = [];
                    foreach ($oldEvents as $key => $event) {
                        $eventInfo[$key] = $event;
                        $hostedBy = json_decode($event['hosted_by'], true);
                        // echo gettype($hostedBy);
                        // print_r($hostedBy);
                        $eveHostDetails = [];
                        if (!empty($hostedBy)) {
                            $eveHostDetails = User::where('id', $hostedBy)
                                ->select('name')
                                ->get();
                            // dd($eveHostDetails);
                        }
                        $eventInfo[$key]['speakers'] = $eveHostDetails;
                    }
                    $result['resources'] = $eventInfo;
                    break;
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
        }
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
                'page' => 'required|string',
                'title' => 'required|string',
                'content' => 'required|string',
                // 'option_1' => 'required|string',
                // 'option_2' => 'required|string',
                'status' => 'required|boolean',
                'title_limit' => 'required|integer',
                'content_limit' => 'required|integer',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()], 400);
            } else {
                $pages = Page::create([
                    'page' => $all['page'],
                    'title' => $all['title'],
                    'content' => $all['content'],
                    // 'option_1' => $all['option_1'], // image
                    // 'option_2' => $all['option_2'],
                    'status' => $all['status'],
                    'title_limit' => $all['title_limit'],
                    'content_limit' => $all['content_limit'],
                    'created_by' => $all['user_id'],

                ]);
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data insertion done..']);
            }
        } catch (\Exception $e) {
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
        try {
            $pages = Page::find($id);
            $result = [];
            $result['pages'] = $pages;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function contentManagmentDrop(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $pagesDrop = [];
            switch ($all['content_type']) {
                case "banner_content":
                    $pagesDrop = Banner::select('page', 'id')->get();
                    break;
                case "page_content":
                    $pagesDrop = Page::select('page', 'id')->get();
                    break;
            }

            $result = [];
            $result['pages_dropdown'] = $pagesDrop;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
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
                'page' => 'required|string',
                'title' => 'required|string',
                'content' => 'required|string',
                // 'option_1' => 'required|string',
                // 'option_2' => 'required|string',
                'status' => 'required|boolean',
                'title_limit' => 'required|integer',
                'content_limit' => 'required|integer',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $pages = Page::find($id);
                $pages->page = $all['page'];
                $pages->title = $all['title'];
                $pages->content = $all['content'];
                $pages->option_1 = $all['option_1'];
                $pages->option_2 = $all['option_2'];
                $pages->status = $all['status'];
                $pages->title_limit = $all['title_limit'];
                $pages->content_limit = $all['content_limit'];
                $pages->modified_by = $all['user_id'];

                $result = $pages->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'updated done..']);
            }
        } catch (\Exception $e) {
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
        try {
            $pages = Page::find($id);
            $pages->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
