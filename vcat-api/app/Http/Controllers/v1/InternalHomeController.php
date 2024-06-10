<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Carrier;
use App\Models\Event;
use App\Models\EventSpeaker;
use App\Models\Permission;
use App\Models\Role;
use App\Models\RolePermission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InternalHomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function latestEvents(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $filterDate = Carbon::today();
            //latest events for home
            // $data = Event::where('status', 0)->select('id', 'name', 'description')->orderBy('id', 'DESC');
            $data = Event::where('to_date', '>=', $filterDate)
                ->orWhere('from_date', '>=', $filterDate)
                ->orderBy('id', 'DESC');
            // $seeAll = $data->get();
            // $latestEvents = $data->limit(5)->get();
            if ($all['see_all'] == true) {
                $result['latestEvents'] = $data->get();
            } else {
                $result['latestEvents'] = $data->limit(5)->get();
            }
            foreach ($result['latestEvents'] as $event) {
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
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function EventsAttend(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $user_id = $all['user_id'];
            // recents events attedend based on member login user id
            $data = Event::where('members', 'like', "%{$user_id}%")->select('id', 'name');
            $seeAll = $data->get();
            $eventsAttended = $data->limit(5)->get();
            if ($all['see_all'] == true) {
                $result['eventsAttended'] = $seeAll;
            } else {
                $result['eventsAttended'] = $eventsAttended;
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function latestCarrier(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $filterDate = Carbon::today();
            // $data = Carrier::where('is_archive', 0)->select('id', 'job_title', 'company_name', 'job_type', 'image')->orderBy('id', 'DESC');
            $data = Carrier::where('date_time', '>=', $filterDate)
                ->orderBy('id', 'DESC');
            // $seeAll = $data->get();
            // $latestCarriers = $data->limit(5)->get();
            if ($all['see_all'] == true) {
                $result['latestCarriers'] = $data->get();
            } else {
                $result['latestCarriers'] = $data->limit(5)->get();
            }
            foreach ($result['latestCarriers'] as $carrier) {
                $carrier["tags"] = !empty($carrier["tags"]) ? json_decode($carrier["tags"]) : [];
            }

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
    public function userDetails(Request $request, $user_id)
    {
        try {
            //$result = User::paginate(6);
            $userDetails = User::where('id', $user_id)->get();

            //for user pemissions based user role id getting all permissions
            $userData = User::where('id', $user_id)->select('role_id')->first();
            $roles = array();
            if (!empty($userData['role_id']) && strpos($userData['role_id'], "[") !== false && strpos($userData['role_id'], "]") !== false) {
                $role_ids = json_decode($userData['role_id'], true);
                foreach ($role_ids as $role_id) {
                    array_push($roles, $role_id);
                }
            } else {
                $role_id = $userData->role_id;
                array_push($roles, $role_id);
            }
            $rolePermission = RolePermission::whereIn('role_id', $roles)->select('permission_id')->get();
            $userPermissions = Permission::whereIn('id', $rolePermission)->select('id', 'name')->get();
            $result = [];
            $result['userDetails'] = $userDetails;
            $result['userPermissions'] = $userPermissions;
            $result["roles"] = $roles;
            $result["role_id"] = $userData['role_id'];

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result], 200);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function feed(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $feeds = new Feed();
            $feeds->title = $all['title'];
            $feeds->photo = $all['photo'];
            $feeds->video = $all['video'];
            $feeds->event_date = $all['event_date'];
            $feeds->document = $all['document'];
            $feeds->artical = $all['artical'];
            $result = $feeds->save();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data insertion done.'], 200);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
