<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\EventSpeaker;
use App\Models\Feed;
use App\Models\Notification;
use App\Models\User;
use App\Models\Wing;
use App\Models\WingMember;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function index(Request $request)
    // {
    //     try
    //     {
    //         $all = json_decode($request->getContent(), true);
    //         $event_content = Page::where('page', 'like', $all['page'] . "%")->get();
    //         return Response(['status' => 'success', 'statuscode' => 200, 'result' => $event_content]);
    //     } catch (\Exception$e) {
    //         return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
    //     }
    // }
    public function index()
    {
        try {
            $events = Event::all();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $events]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function allEvents(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
            $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');
            // setting the currentPage into Paginator
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });

            $user = Event::orderBy('id', 'DESC')
                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('venue', 'LIKE', "%{$all['search']}%")
                        ->orWhere('description', 'LIKE', "%{$all['search']}%")
                        ->orWhere('from_date', 'LIKE', "%{$all['search']}%")
                        ->orWhere('to_date', 'LIKE', "%{$all['search']}%")
                        ->orWhere('city', 'LIKE', "%{$all['search']}%")
                        ->orWhere('event_type', 'LIKE', "%{$all['search']}%")
                        ->orWhere('meeting_type', 'LIKE', "%{$all['search']}%")
                        ->orWhere('created_by', 'LIKE', "%{$all['search']}%")
                        ->orWhere('prsentation_material', 'LIKE', "%{$all['search']}%");
                })
                ->when(!empty($all['filter']) && $all['filter'] != 'more than one year', function ($query) use ($all) {
                    switch ($all['filter']) {
                        case "one week":
                            $filterData = Carbon::today()->subDays(6);
                            break;
                        case "15 days":
                            $filterData = Carbon::today()->subDays(15);
                            break;
                        case "30 days":
                            $filterData = Carbon::today()->subDays(30);
                            break;
                        case "6 months":
                            $filterData = Carbon::now()->subMonths(6);
                            break;
                        case "one year":
                            $filterData = Carbon::now()->subMonths(12);
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                });
            $events = $user->paginate($pageLimit);
            $result = [];
            $result['events_list'] = $events;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
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
            $speakers = [];
            $all = json_decode($request->getContent(), true);
            $rules = array(
                'name' => 'required',

                // -------Recent Changes
                // 'hosted_by' => 'required',
                // 'from_date' => 'required|date',
                // 'to_date' => 'required|date',
                // 'code' => 'integer',
                // 'city' => 'required',
                // 'description' => 'required',
                // 'meeting_type' => 'required',
                // Recent Changes-------

                //'event_type' => 'required',
                //'prsentation_material' => 'required',
                //'venue' => 'required',
                // 'members' => 'required',
                // 'wings' => 'required',
                //'topic' => 'required',
                // 'option_1' => 'required',
                // 'status' => 'required|bool',
                // 'image' => 'required',
                // 'agenda' => 'required|mimes:csv,txt,xlx,xls,pdf|max:2048',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $events = new Event();
                $events->name = $all['name'];
                // $events->hosted_by = json_encode($all['hosted_by']);
                $events->hosted_by = $all['hosted_by'];
                $events->from_date = $all['from_date'];
                $events->to_date = $all['to_date'];
                $events->code = $all['code'];
                $events->city = $all['city'];
                $events->description = $all['description'];
                $events->meeting_type = $all['meeting_type'];
                $events->event_type = $all['event_type'];
                // $events->prsentation_material = $all['prsentation_material']; //replace agenda
                $events->venue = $all['venue'];
                $events->members = json_encode($all['members']);
                $events->wings = json_encode($all['wings']);
                $events->agenda = $all['filePath'];
                $events->topic = $all['topic'];
                $events->option_1 = !empty($all['option_1']) ? $all['option_1'] : null;
                // $events->status = $all['status'];
                $events->image = $all['image'];
                $events->created_by = $all['user_id'];
                $events->event_tags = !empty($all['event_tags']) ? json_encode($all['event_tags']) : "[]";
                $events->gallery = !empty($all['gallery']) ? json_encode($all['gallery']) : "[]";
                $events->yet_to_be_decided = $all['yet_to_be_decided'];
                $events->event_for = $all['event_for'];
                $result = $events->save();
                $event_id = $events->id;
                if ($all['speakers']) {
                    $speakers = json_decode($all['speakers'], true);
                    if (is_array($speakers)) {
                        foreach ($speakers as $speaker_details) {
                            $eventSpeaker = new EventSpeaker();
                            $eventSpeaker['speaker'] = $speaker_details['speaker'];
                            $eventSpeaker['position'] = $speaker_details['position'];
                            $eventSpeaker['image'] = !empty($speaker_details['image']) ? $speaker_details['image'] : null;
                            $eventSpeaker['event_id'] = $event_id;
                            $eventSpeaker->created_by = $all['user_id'];
                            $eventSpeaker->modified_by = $all['user_id'];
                            $eventSpeaker->save();
                        }
                    }
                }
                // $mail_notification_result = $this->sendEventInviteMail($event_id);

                // $eventFeeds = new Feed();
                // $eventFeeds->feed_name = $all['name'];
                // $eventFeeds->event_hosted = json_encode($all['hosted_by']);
                // $eventFeeds->discription = $all['description'];
                // $eventFeeds->feed_paths = $all['filePath'];
                // $eventFeeds->user_id = $all['user_id'];
                // if ($eventFeeds->save()) {
                //     $string = json_decode(json_encode($all['wings']), true);
                //     $wingMembers = WingMember::whereIn('wing_id', $string)->select('members')->get()->toArray(); //type array
                //     $member = [];
                //     if (!empty($wingMembers)) {
                //         foreach ($wingMembers as $wingMember) {
                //             $userIds = json_decode($wingMember['members'], true);
                //             foreach ($userIds as $ids) {
                //                 array_push($member, $ids);
                //             }
                //         }
                //         $new = json_decode(json_encode($all['members']), true); ///string type
                //         foreach ($new as $id) {
                //             array_push($member, $id);
                //         }
                //     }
                //     $result = array_unique($member);
                //     sort($result, SORT_NUMERIC);

                //     $notifications = new Notification();
                //     $notifications->notification_title = 'Event ' . $all['name'] . ' created';
                //     $notifications->notification_message = 'New Event created on this date ' . date('D M-Y', strtotime($all['from_date'])) . " at " . $all['venue'];
                //     $notifications->send_to = json_encode($result);
                //     $notifications->created_by = $all['user_id'];
                //     $result = $notifications->save();

                //     // $user = User::WhereIn('id', $result)->get();
                //     // FCMService::send(
                //     //     $user->fcm_token,
                //     //     [
                //     //         'title' => $notifications->notification_title,
                //     //         'body' => $notifications->notification_message,
                //     //     ],
                //     //     [
                //     //         'message' => 'Extra Notification Data',
                //     //     ],
                //     // );
                // }
                return Response([
                    'status' => 'success',
                    'statuscode' => 200,
                    'result' => 'data insertion done',
                    // 'mail_notification_result' => $mail_notification_result,
                    "event_id" => $event_id,
                    "speakers" => $speakers
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'statusCode' => 500, 'result' => "error" . $e->getMessage(), "speakers" => $speakers], 500);
        }
    }

    public function eventRegistration(Request $request)
    {
        // try {
        $all = json_decode($request->getContent(), true);

        $rules = array(
            'name' => 'required|max:255',
            //'mobile_number' => 'required|numeric|min:10|unique:event_registrations',
            'mobile_number' => 'required|numeric',
            // 'email' => 'required|email|unique:event_registrations',
            'email' => 'required|email',
            // 'description' => 'required',
        );
        $Validator = Validator::make($all, $rules);
        if ($Validator->fails()) {
            return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
        } else {

            $eventRegistrations = new EventRegistration();
            $eventRegistrations->name = $all['name'];
            $eventRegistrations->email = $all['email'];
            $eventRegistrations->mobile_number = $all['mobile_number'];
            $eventRegistrations->description = $all['description'];
            $eventRegistrations->wing_rank = $all['wing_rank'];
            $result = $eventRegistrations->save();

            // for client
            Mail::send('event_registration_client', $all, function ($message) use ($all) {
                $message->to($all['email'])->subject('Thank you for Event registration.');
                $message->from('info@vcat.co.in', 'Vcat');
            });

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data insertion done']);
        }
        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        // }
    }

    public function allRegistrations()
    {
        try {
            $events = EventRegistration::all();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $events]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function registrationsDestroy($id)
    {
        try {
            $registrations = EventRegistration::find($id);
            $registrations->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'event registration has been deleted sucess']);
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
            $events = Event::find($id);
            $result = [];
            $result['events'] = $events;
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
        // try {
        $all = json_decode($request->getContent(), true);

        $rules = array(
            // 'name' => 'required|max:255',
            // 'hosted_by' => 'required',
            // 'from_date' => 'required|date',
            // 'to_date' => 'required|date',
            // 'code' => 'required|integer',
            // 'city' => 'required',
            // 'description' => 'required|max:500',
            // 'meeting_type' => 'required',
            // 'event_type' => 'required',
            // 'prsentation_material' => 'required',
            // 'venue' => 'required',
            // 'members' => 'required',
            // 'wings' => 'required',
            // 'topic' => 'required',
            // 'option_1' => 'required',
            // 'status' => 'required|bool',
            // 'image' => 'required',
        );
        $Validator = Validator::make($all, $rules);
        if (!$Validator->passes()) {
            return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
        } else {
            $events = Event::find($id);
            $events->name = $all['name'];
            // $events->hosted_by = json_encode($all['hosted_by']);
            $events->hosted_by = $all['hosted_by'];
            $events->from_date = $all['from_date'];
            $events->to_date = $all['to_date'];
            $events->code = $all['code'];
            $events->city = $all['city'];
            $events->description = $all['description'];
            $events->meeting_type = $all['meeting_type'];
            $events->event_type = $all['event_type'];
            // $events->prsentation_material = $all['prsentation_material'];
            $events->venue = $all['venue'];
            $events->members = json_encode($all['members']);
            $events->wings = json_encode($all['wings']);
            $events->agenda = $all['agenda'];
            $events->topic = $all['topic'];
            // $events->option_1 = $all['option_1'];
            // $events->status = $all['status'];
            $events->image = $all['image'];
            $events->modified_by = $all['user_id'];

            $events->event_tags = !empty($all['event_tags']) ? json_encode($all['event_tags']) : "[]";

            $events->yet_to_be_decided = $all['yet_to_be_decided'];

            $events->event_for = $all['event_for'];

            $events->save();
            $result = [];
            $result['events'] = $events;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        }
        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        // }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function destroy(Request $request, $id)
    // {
    //     // try
    //     // {
    //     $all = json_decode($request->getContent(), true);
    //     $user_id = $all['user_id'];
    //     $userRoleid = User::where('id', $user_id)->first();
    //     $role_id = $userRoleid->role_id;
    //     $allowedPermissions = RolePermission::where('role_id', $role_id)->where('is_deleted', 0)->pluck('permission_id')->toArray();
    //     $permissions = Permission::pluck('id')->toArray();
    //     $deletable = array_intersect($allowedPermissions, $permissions);

    //     //$plucked = RolePermission::pluck('permission_id');

    //     // dd($permissions);
    //     //echo gettype($permissions);
    //     //  $created_by = $permissions->permission_id;
    //     if ($allowedPermissions) {
    //         $events = Event::find($id);
    //         $events->delete();
    //         return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess'], 200);
    //     } else {
    //         return Response(['status' => 'success', 'statuscode' => 500, 'result' => 'you dont have access to delete'], 500);

    //     }

    //     // } catch (\Exception$e) {
    //     //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()]);
    //     // }
    // }
    public function destroy($id)
    {
        try {
            $events = Event::find($id);
            $events->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'event has been deleted sucess']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function dropDown(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $wings = Wing::select('title', 'id')->get();
            //selected wing id based on, getting memebrs except selected wing members
            if (!empty($all['check_all_wings'])) {
                $result = [];
                foreach ($wings as $wing) {
                    $list = $wing['id'];
                    array_push($result, $list);
                }
                // dd($result);
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
            }

            if (!empty($all['wing_id'])) {
                $users = User::where('wings', 'not like', "%{$all['wing_id']}%")->select('name', 'id', 'wings')->get();
            } else {
                $users = User::select('name', 'id')->get();
            }
            if (!empty($all['check_all_users'])) {
                $result = [];
                foreach ($users as $user) {
                    $list = $user['id'];
                    array_push($result, $list);
                }
                // dd($result);
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
            }

            // $hosted_by = User::select('name', 'id')->get();

            $result = [];
            $result['wings_dropdown'] = $wings;
            $result['users_dropdown'] = $users;
            // $result['hostedby_dropdown'] = $hosted_by;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function Filter(Request $request)
    {
        //$all = json_decode($request->getContent(), true);

        try {
            $all = json_decode($request->getContent(), true);
            switch ($all['filter']) {
                case "one week":
                    $filterData = Carbon::today()->subDays(6);
                    break;
                case "15 days":
                    $filterData = Carbon::today()->subDays(15);
                    break;
                case "30 days":
                    $filterData = Carbon::today()->subDays(30);
                    break;
                case "6 months":
                    $filterData = Carbon::now()->subMonths(6);
                    break;
                case "one year":
                    $filterData = Carbon::now()->subMonths(12);
                    break;
                case "more than one year":
                    $moreOne = Event::orderBy('id', 'DESC')->get();
                    break;
            }
            if ($all['filter'] == 'more than one year') {
                $result['more than one year'] = $moreOne;
            } else {
                $filter = Event::where('created_at', '>=', $filterData)->orderBy('id', 'DESC')->get();
                $result['filter_data'] = $filter;
            }

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
        }
    }
    public function tableData(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $result = Event::orderBy('id', 'DESC')
                ->when(!empty($all['filter']) && $all['filter'] != 'more than one year', function ($query) use ($all) {
                    switch ($all['filter']) {
                        case "one week":
                            $filterData = Carbon::today()->subDays(6);
                            break;
                        case "15 days":
                            $filterData = Carbon::today()->subDays(15);
                            break;
                        case "30 days":
                            $filterData = Carbon::today()->subDays(30);
                            break;
                        case "6 months":
                            $filterData = Carbon::now()->subMonths(6);
                            break;
                        case "one year":
                            $filterData = Carbon::now()->subMonths(12);
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                })->get();
            foreach ($result as $key => $event) {
                $event['registrations'] = [];
                $event['registrations'] = EventRegistration::where('event_id', $event['id'])->get();
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function pageInfo()
    {
        try {
            $result = [];
            $upcoming_events = [];
            $past_events = [];
            $events = Event::where('yet_to_be_decided', '=', '0')
                ->orderBy('from_date', 'DESC')
                ->select(
                    'id',
                    'name',
                    'code',
                    'description',
                    'image',
                    'hosted_by',
                    'from_date',
                    'to_date',
                    'city',
                    'meeting_type',
                    'event_type',
                    'venue',
                    'gallery',
                    'event_tags',
                    'yet_to_be_decided',
                    'event_for'
                )->get();
            $filterDate = Carbon::today();
            foreach ($events as $event) {
                //
                // $event["event_tags"] = ["Finance", "Economics"];
                $event["event_tags"] = !empty($event["event_tags"]) ? json_decode($event["event_tags"]) : [];
                $event["gallery"] = !empty($event["gallery"]) ? json_decode($event["gallery"]) : [];
                //
                $eventSpeakers = EventSpeaker::where("event_id", "=", $event["id"])
                    ->select("speaker", "position", "image")
                    ->get();
                $event["event_speakers"] = !empty($eventSpeakers) ? $eventSpeakers : [];
                // $hosted_by = array();
                // $hostsIds = json_decode($event['hosted_by'], true);
                // if (is_array($hostsIds)) {
                //     foreach ($hostsIds as $hostId) {
                //         if (is_numeric($hostId)) {
                //             $hostDetails = User::find($hostId);
                //             if ($hostDetails) {
                //                 $host = [];
                //                 $host['id'] = $hostDetails['id'];
                //                 $host['name'] = $hostDetails['name'];
                //                 $host['image'] = $hostDetails['image'];
                //                 $host['occupation'] = $hostDetails['occupation'];
                //                 if ($host) {
                //                     array_push($hosted_by, $host);
                //                 }
                //             }
                //         }
                //     }
                // }
                // $event['hosted_by'] = $hosted_by;
                if ($event['from_date'] >= $filterDate) {
                    array_push($upcoming_events, $event);
                } else {
                    array_push($past_events, $event);
                }
            }
            $result['upcoming_events'] = $upcoming_events;
            $result['past_events'] = $past_events;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function eventParticipantRegistration(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);

            $rules = array(
                'name' => 'required|max:255',
                'mobile_number' => 'required|numeric',
                'email' => 'required|email',
                // 'icai_membership_no' => 'required',
                'vcat_membership_status' => 'required',
                // 'message' => 'required',
                'event_id' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
            } else {
                $eventRegistrations = new EventRegistration();
                $eventRegistrations->event_id = $all['event_id'];
                $eventRegistrations->name = $all['name'];
                $eventRegistrations->email = $all['email'];
                $eventRegistrations->mobile_number = $all['mobile_number'];
                $eventRegistrations->icai_membership_no = $all['icai_membership_no'];
                $eventRegistrations->vcat_membership_status = $all['vcat_membership_status'];
                $eventRegistrations->message = $all['message'];
                $result = $eventRegistrations->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'Registered Successfully']);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function updateEventGallery(Request $request, $id)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $events = Event::find($id);
            $events["gallery"] = !empty($all["gallery"]) ? json_encode($all["gallery"]) : "[]";
            $result = $events->save();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'Gallery updated Successfully']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function saveEventSpeaker(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);

            $rules = array(
                'speaker' => 'required',
                'position' => 'required',
                // 'image' => 'required',
                'event_id' => 'required',
                'user_id' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $eventSpeaker = new EventSpeaker();
                $eventSpeaker['speaker'] = $all['speaker'];
                $eventSpeaker['position'] = $all['position'];
                $eventSpeaker['image'] = !empty($all['image']) ? $all['image'] : null;
                $eventSpeaker['event_id'] = $all['event_id'];
                $eventSpeaker->created_by = $all['user_id'];
                $eventSpeaker->modified_by = $all['user_id'];
                $eventSpeaker->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'Speaker Added Successfully']);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function updateEventSpeaker(Request $request, $id)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $eventSpeaker = EventSpeaker::find($id);
            if (!empty($all['speaker'])) {
                $eventSpeaker['speaker'] = $all['speaker'];
            }
            if (!empty($all['position'])) {
                $eventSpeaker['position'] = $all['position'];
            }
            if (!empty($all['image'])) {
                $eventSpeaker['image'] = $all['image'];
            }
            $eventSpeaker->modified_by = $all['user_id'];
            $eventSpeaker->save();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'Speaker Updated Successfully']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function deleteEventSpeaker($id)
    {
        try {
            $eventSpeaker = EventSpeaker::find($id);
            $eventSpeaker->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'Speaker Deleted Successfully']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function getEventSpeaker($id)
    {
        try {
            $eventSpeakers = EventSpeaker::where('event_id', '=', $id)->get();
            $result = [];
            $result['eventSpeakers'] = $eventSpeakers;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function sendEventInviteMail($id, $userId)
    {
        try {
            // Bcc emails
            $to_ids = array();
            $to_addresses = "";

            $event_details = Event::find($id);
            if (empty($event_details)) {
                return "Event Id " . $id . " not found";
            }
            // $hosts = "";
            $hosts = $event_details['hosted_by'];
            $speakers = "";

            $event_speakers = EventSpeaker::where("event_id", "=", $event_details["id"])
                ->select("speaker", "position")
                ->get();
            $event_details["event_speakers"] = !empty($event_speakers) ? $event_speakers : [];
            if (!empty($event_details["event_speakers"])) {
                foreach ($event_details["event_speakers"] as $speaker) {
                    if ($speaker && $speaker['speaker']) {
                        $current_speaker = $speaker['speaker'] . " ( " . $speaker['position'] . " ) ";
                        if ($speakers == "") {
                            $speakers = $current_speaker;
                        } else {
                            $speakers = $speakers . ", " . $current_speaker;
                        }
                    }
                }
            }

            // $hosts_ids = json_decode($event_details['hosted_by'], true);
            // if (is_array($hosts_ids)) {
            //     foreach ($hosts_ids as $host_id) {
            //         if (is_numeric($host_id)) {
            //             $host_details = User::find($host_id);
            //             if ($host_details && $host_details['name']) {
            //                 if ($hosts == "") {
            //                     $hosts = $host_details['name'];
            //                 } else {
            //                     $hosts = $hosts . ", " . $host_details['name'];
            //                 }
            //                 if (!in_array($host_details['id'], $to_ids)) {
            //                     array_push($to_ids, $host_details['id']);
            //                     if ($to_addresses == "") {
            //                         $to_addresses = $host_details['email'];
            //                     } else {
            //                         $to_addresses = $to_addresses . ", " . $host_details['email'];
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }

            $member_ids = json_decode($event_details['members'], true);
            if (is_array($member_ids)) {
                foreach ($member_ids as $member_id) {
                    if (is_numeric($member_id)) {
                        $member_details = User::find($member_id);
                        if ($member_details && $member_details['name']) {
                            if (!in_array($member_details['id'], $to_ids)) {
                                array_push($to_ids, $member_details['id']);
                                if ($to_addresses == "") {
                                    $to_addresses = "<" . $member_details['email'] . ">";
                                } else {
                                    if ($member_details['email'] != null) {
                                        $to_addresses = $to_addresses . " , " . $member_details['email'];
                                    }
                                }
                            }
                        }
                    }
                }
            }

            $wing_ids = json_decode($event_details['wings'], true);
            if (is_array($wing_ids)) {
                $wing_members = array();
                foreach ($wing_ids as $wing_id) {
                    if (is_numeric($wing_id)) {
                        $wings = WingMember::where("wing_id", "=", $wing_id)
                            ->select("members")
                            ->get()
                            ->toArray();
                        if ($wings) {
                            foreach ($wings as $wing) {
                                if ($wing['members']) {
                                    $current_wing_members = json_decode($wing['members'], true);
                                    if (is_array($current_wing_members)) {
                                        foreach ($current_wing_members as $current_wing_member_id) {
                                            if (is_numeric($current_wing_member_id)) {
                                                array_push($wing_members, $current_wing_member_id);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                foreach ($wing_members as $wing_member_id) {
                    $member_details = User::find($wing_member_id);
                    if ($member_details) {
                        if (!in_array($member_details['id'], $to_ids)) {
                            array_push($to_ids, $member_details['id']);
                            if ($to_addresses == "") {
                                $to_addresses = "<" . $member_details['email'] . ">";
                            } else {
                                if ($member_details['email'] != null) {
                                    $to_addresses = $to_addresses . " , " . $member_details['email'];
                                }
                            }
                        }
                    }
                }
            }

            if ($event_details->meeting_type == "on_site") {
                $event_details->meeting_type = "on site";
            }

            $event_from_date_obj = date_create($event_details->from_date);
            $event_from_date = date_format($event_from_date_obj, "jS") . " of " . date_format($event_from_date_obj, "F") . " " . date_format($event_from_date_obj, "Y");
            $event_from_time = date_format($event_from_date_obj, "H:i A");

            $event_to_date_obj = date_create($event_details->to_date);
            $event_to_date = date_format($event_to_date_obj, "jS") . " of " . date_format($event_to_date_obj, "F") . " " . date_format($event_to_date_obj, "Y");
            $event_to_time = date_format($event_to_date_obj, "H:i A");

            $event_banner = $event_details['image'];
            if (empty($event_banner)) {
                $event_banner = "https://admin.vcat.co.in/static/media/Eve.58a5279d87aaad927248.jpg";
            }
            #region HTML Mail Body
            $html_body = '
                    <!doctype html>
                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                    xmlns:o="urn:schemas-microsoft-com:office:office">

                    <head>
                    <title> VCAT </title>
                    <!--[if !mso]><!-->
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <!--<![endif]-->
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style type="text/css">
                        #outlook a {
                        padding: 0;
                        }

                        body {
                        margin: 0;
                        padding: 0;
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        }

                        table,
                        td {
                        border-collapse: collapse;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        }

                        img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                        -ms-interpolation-mode: bicubic;
                        }

                        p {
                        display: block;
                        margin: 13px 0;
                        }
                    </style>
                    <!--[if mso]>
                            <noscript>
                            <xml>
                            <o:OfficeDocumentSettings>
                            <o:AllowPNG/>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                            </xml>
                            </noscript>
                            <![endif]-->
                    <!--[if lte mso 11]>
                            <style type="text/css">
                            .mj-outlook-group-fix { width:100% !important; }
                            </style>
                            <![endif]-->
                    <style type="text/css">
                        @media only screen and (min-width:480px) {
                        .mj-column-per-100 {
                            width: 100% !important;
                            max-width: 100%;
                        }
                        }
                    </style>
                    <style media="screen and (min-width:480px)">
                        .moz-text-html .mj-column-per-100 {
                        width: 100% !important;
                        max-width: 100%;
                        }
                    </style>
                    <style type="text/css">
                        @media only screen and (max-width:480px) {
                        table.mj-full-width-mobile {
                            width: 100% !important;
                        }

                        td.mj-full-width-mobile {
                            width: auto !important;
                        }
                        }
                    </style>
                    </head>

                    <body style="word-spacing:normal;background-color:#E7E7E7;">
                    <div
                        style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
                        Pre-header Text </div>
                    <div style="background-color:#E7E7E7;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                        style="background:#74e8e2;background-color:#74e8e2;width:100%;">
                        <tbody>
                            <tr>
                            <td>
                                <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#74e8e2" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                                <div style="margin:0px auto;max-width:600px;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                                    <tbody>
                                    <tr>
                                        <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;text-align:center;">
                                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                            style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                            style="vertical-align:top;" width="100%">
                                            <tbody>
                                                <tr>
                                                <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                    style="border-collapse:collapse;border-spacing:0px;">
                                                    <tbody>
                                                        <tr>
                                                        <td style="width:100px;">
                                                            <img alt height="auto"
                                                            src="https://vcat.co.in/favicon.png"
                                                            style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                                            width="100">
                                                        </td>
                                                        </tr>
                                                    </tbody>
                                                    </table>
                                                </td>
                                                </tr>
                                                <tr>
                                                <td align="center"
                                                    style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                                                    <div
                                                    style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:bold;letter-spacing:1px;line-height:24px;text-align:center;text-transform:uppercase;color:#000000;">
                                                    SRI VASAVI CA CHARITABLE TRUST (VCAT) <br>
                                                    <span style="color: #979797; font-weight: normal">-</span>
                                                    </div>
                                                </td>
                                                </tr>
                                                <tr>
                                                <td align="center"
                                                    style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                    <div
                                                    style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;line-height:20px;text-align:center;text-transform:uppercase;color:#000000;">
                                                    No.9 Ground Floor, 9th Main, <br> 2nd Block Jayanagar, Bengaluru - 560011, Karnataka,
                                                    India <br></div>
                                                </td>
                                                </tr>
                                                <tr>
                                                <td align="center"
                                                    style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                    <div
                                                    style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;letter-spacing:1px;line-height:20px;text-align:center;text-transform:uppercase;color:#000000;">
                                                    Event Details</div>
                                                </td>
                                                </tr>
                                                <tr>
                                                <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                    style="border-collapse:collapse;border-spacing:0px;">
                                                    <tbody>
                                                        <tr>
                                                        <td style="width:600px;">
                                                            <a href="https://google.com" target="_blank">
                                                            <img alt height="auto"
                                                                src="' . $event_banner . '"
                                                                style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                                                width="600">
                                                            </a>
                                                        </td>
                                                        </tr>
                                                    </tbody>
                                                    </table>
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                </div>
                                <!--[if mso | IE]></td></tr></table><![endif]-->
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="body-section-outlook" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                        <div class="body-section"
                        style="-webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); margin: 0px auto; max-width: 600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                            <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:0;text-align:center;">
                                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                                <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                    style="background:#ffffff;background-color:#ffffff;width:100%;">
                                    <tbody>
                                        <tr>
                                        <td
                                            style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:570px;" ><![endif]-->
                                            <div class="mj-column-per-100 mj-outlook-group-fix"
                                            style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">
                                                        ' . $event_details['name'] . '
                                                    </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        Hi members,</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        Below are the details for an upcoming event
                                                    </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        ' . $event_details['description'] . '
                                                    </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-bottom:30px;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        <b>
                                                        Event is scheduled on ' . $event_from_date . ' at ' . $event_from_time . ' and ends on ' . $event_to_date . ' at ' . $event_to_time . '. Venue is ' . $event_details['venue'] . '.</b></div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        Meeting is hosted by ' . $hosts . ' and list of speaker(s) going to be present are ' . $speakers . '.</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        This is an ' . $event_details['meeting_type'] . ' meeting and is ' . $event_details['event_type'] . ' event.</div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                            <!--[if mso | IE]></td></tr></table><![endif]-->
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                                <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                    style="background:#ffffff;background-color:#ffffff;width:100%;">
                                    <tbody>
                                        <tr>
                                        <td
                                            style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;padding-top:0;text-align:center;">
                                            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:570px;" ><![endif]-->
                                            <div class="mj-column-per-100 mj-outlook-group-fix"
                                            style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <p style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:100%;">
                                                    </p>
                                                    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:520px;" role="presentation" width="520px" ><tr><td style="height:0;line-height:0;"> &nbsp;
                    </td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                            <!--[if mso | IE]></td></tr></table><![endif]-->
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                                <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                    style="background:#ffffff;background-color:#ffffff;width:100%;">
                                    <tbody>
                                        <tr>
                                        <td style="direction:ltr;font-size:0px;padding:0 15px 0 15px;text-align:center;">
                                            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:570px;" ><![endif]-->
                                            <div class="mj-column-per-100 mj-outlook-group-fix"
                                            style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <div
                                                            style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        ' . "We're looking forward for the event." . '
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                            <!--[if mso | IE]></td></tr></table><![endif]-->
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                            <tr>
                            <td>
                                <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                                <div style="margin:0px auto;max-width:600px;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                                    <tbody>
                                    <tr>
                                        <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                                        <div style="margin:0px auto;max-width:600px;">
                                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                            style="width:100%;">
                                            <tbody>
                                                <tr>
                                                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                                    style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td style="vertical-align:top;padding:0;">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style
                                                                width="100%">
                                                                <tbody>
                                                                <tr>
                                                                    <td align="center"
                                                                    style="font-size:0px;padding:0;word-break:break-word;">
                                                                    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td><![endif]-->
                                                                    <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                        role="presentation" style="float:none;display:inline-table;">
                                                                        <tr>
                                                                        <td style="padding:4px;vertical-align:middle;">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                            role="presentation"
                                                                            style="background:#A1A0A0;border-radius:3px;width:30px;">
                                                                            <tr>
                                                                                <td
                                                                                style="font-size:0;height:30px;vertical-align:middle;width:30px;">
                                                                                <a href="https://www.facebook.com/sharer/sharer.php?u=https://mjml.io/"
                                                                                    target="_blank">
                                                                                    <img height="30"
                                                                                    src="https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png"
                                                                                    style="border-radius:3px;display:block;" width="30">
                                                                                </a>
                                                                                </td>
                                                                            </tr>
                                                                            </table>
                                                                        </td>
                                                                        </tr>
                                                                    </table>
                                                                    <!--[if mso | IE]></td><td><![endif]-->
                                                                    <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                        role="presentation" style="float:none;display:inline-table;">
                                                                        <tr>
                                                                        <td style="padding:4px;vertical-align:middle;">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                            role="presentation"
                                                                            style="background:#A1A0A0;border-radius:3px;width:30px;">
                                                                            <tr>
                                                                                <td
                                                                                style="font-size:0;height:30px;vertical-align:middle;width:30px;">
                                                                                <a href="https://plus.google.com/share?url=https://mjml.io/"
                                                                                    target="_blank">
                                                                                    <img height="30"
                                                                                    src="https://www.mailjet.com/images/theme/v1/icons/ico-social/google-plus.png"
                                                                                    style="border-radius:3px;display:block;" width="30">
                                                                                </a>
                                                                                </td>
                                                                            </tr>
                                                                            </table>
                                                                        </td>
                                                                        </tr>
                                                                    </table>
                                                                    <!--[if mso | IE]></td><td><![endif]-->
                                                                    <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                        role="presentation" style="float:none;display:inline-table;">
                                                                        <tr>
                                                                        <td style="padding:4px;vertical-align:middle;">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                            role="presentation"
                                                                            style="background:#A1A0A0;border-radius:3px;width:30px;">
                                                                            <tr>
                                                                                <td
                                                                                style="font-size:0;height:30px;vertical-align:middle;width:30px;">
                                                                                <a href="https://twitter.com/intent/tweet?url=https://mjml.io/"
                                                                                    target="_blank">
                                                                                    <img height="30"
                                                                                    src="https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png"
                                                                                    style="border-radius:3px;display:block;" width="30">
                                                                                </a>
                                                                                </td>
                                                                            </tr>
                                                                            </table>
                                                                        </td>
                                                                        </tr>
                                                                    </table>
                                                                    <!--[if mso | IE]></td><td><![endif]-->
                                                                    <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                        role="presentation" style="float:none;display:inline-table;">
                                                                        <tr>
                                                                        <td style="padding:4px;vertical-align:middle;">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                            role="presentation"
                                                                            style="background:#A1A0A0;border-radius:3px;width:30px;">
                                                                            <tr>
                                                                                <td
                                                                                style="font-size:0;height:30px;vertical-align:middle;width:30px;">
                                                                                <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://mjml.io/&title=&summary=&source="
                                                                                    target="_blank">
                                                                                    <img height="30"
                                                                                    src="https://www.mailjet.com/images/theme/v1/icons/ico-social/linkedin.png"
                                                                                    style="border-radius:3px;display:block;" width="30">
                                                                                </a>
                                                                                </td>
                                                                            </tr>
                                                                            </table>
                                                                        </td>
                                                                        </tr>
                                                                    </table>
                                                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center"
                                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                    <div
                                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">
                                                                        &copy; VCAT Inc.</div>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    </div>
                                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                </div>
                                <!--[if mso | IE]></td></tr></table><![endif]-->
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </body>
                    </html>
            ';
            #endregion HTML Mail Body

            $senderDetails = User::find($userId);
            $to_addresses = strtolower($to_addresses);
            $bcc = $to_addresses;
            $header_array = array(
                "From: VCAT<info@vcat.co.in>;",
                "MIME-Version: 1.0;",
                // "Content-type: text/html;",
                "Content-Type: text/html;charset=utf-8",
                // "Content-Type: text/html; charset=ISO-8859-1",
                // "Content-Transfer-Encoding: base64"
            );
            if ($bcc != "") {
                array_push($header_array, "Bcc: " . $bcc . ";");
            }
            // $headers = "MIME-Version: 1.0" . "\r\n" . "Content-type: text/html;charset=UTF-8" . "\r\n" . 'From: VCAT<info@vcat.co.in>' . "\r\n";
            $headers = implode("\r\n", $header_array);
            // if ($bcc != "") {
            //     $headers .= "Bcc: $bcc" . "\r\n";
            // }
            $subject = "VCAT Event: " . $event_details->name;
            // $result = mail($to_addresses, $subject, $html_body, $headers);
            // $result = mail($senderDetails->email, $subject, chunk_split(base64_encode($html_body)), $headers);
            $result = mail($senderDetails->email, $subject, $html_body, $headers);
            if ($result) {
                $result = ["to_addresses" => $to_addresses, "subject" => $subject, "headers" => $headers];
            }
            return $result;
        } catch (\Exception $e) {
            return "error" . $e->getMessage();
        }
    }
    public function notifyEventMembers($id, $userId)
    {
        try {
            $mail_result = false;
            $feed_result = "Already exists";
            $notification_result = false;
            $event_details = Event::find($id);
            if ($event_details) {
                // Mail Notification
                $mail_result = $this->sendEventInviteMail($id, $userId);
                // Event Post
                if ($event_details->feed_id == null) {
                    $feed_result = "Needs to be created";
                    $event_feeds = new Feed();
                    $event_feeds->feed_name = $event_details['name'];
                    // $event_feeds->event_hosted = $event_details['hosted_by'];
                    $event_feeds->discription = $event_details['description'];
                    $event_feeds->feed_paths = $event_details['filePath'];
                    $event_feeds->user_id = $event_details['created_by'];
                    if ($event_feeds->save()) {
                        $event_details->feed_id = $event_feeds->id;
                        $event_details->save();
                        $feed_result = "Created Successfully";
                        $string = json_decode($event_details['wings'], true);
                        $wingMembers = WingMember::whereIn('wing_id', $string)->select('members')->get()->toArray(); //type array
                        $member = [];
                        if (!empty($wingMembers)) {
                            foreach ($wingMembers as $wingMember) {
                                $userIds = json_decode($wingMember['members'], true);
                                foreach ($userIds as $ids) {
                                    array_push($member, $ids);
                                }
                            }
                            $new = json_decode($event_details['members'], true); ///string type
                            foreach ($new as $id) {
                                array_push($member, $id);
                            }
                        }
                        $result = array_unique($member);
                        sort($result, SORT_NUMERIC);

                        $notifications = new Notification();
                        $notifications->notification_title = 'Event ' . $event_details['name'] . ' created';
                        $notifications->notification_message = 'New Event created on this date ' . date('D M-Y', strtotime($event_details['from_date'])) . " at " . $event_details['venue'];
                        $notifications->send_to = json_encode($result);
                        $notifications->created_by = $event_details['created_by'];
                        $$notification_result = $notifications->save();

                        // $user = User::WhereIn('id', $result)->get();
                        // FCMService::send(
                        //     $user->fcm_token,
                        //     [
                        //         'title' => $notifications->notification_title,
                        //         'body' => $notifications->notification_message,
                        //     ],
                        //     [
                        //         'message' => 'Extra Notification Data',
                        //     ],
                        // );
                    }
                }
            }
            return Response([
                'status' => 'success',
                'statuscode' => 200,
                'result' => "Mail Sent",
                'feed_result' => $feed_result,
                'notification_result' => $notification_result,
                'mail_result' => $mail_result
            ]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
