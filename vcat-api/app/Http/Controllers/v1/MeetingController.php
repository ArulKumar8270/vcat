<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Feed;
use App\Models\Meeting;
use App\Models\Mom;
use App\Models\Notification;
use App\Models\User;
use App\Models\WingMember;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MeetingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
            $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');
            // setting the currentPage into Paginator
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });
            //latest mettings
            $latestMetting = Meeting::where('status', 0)
                // ->whereDate('from_date', '>', date('Y-m-d'))
                ->orderBy('id', 'DESC')
                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('date_time', 'LIKE', "%{$all['search']}%")
                        ->orWhere('city', 'LIKE', "%{$all['search']}%")
                        ->orWhere('modified_by', 'LIKE', "%{$all['search']}%")
                        ->orWhere('hosted_by', 'LIKE', "%{$all['search']}%")
                        ->orWhere('invocation', 'LIKE', "%{$all['search']}%")
                        ->orWhere('created_at', 'LIKE', "%{$all['search']}%");
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
                        case "more than one year":
                            $filterData = Meeting::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                });
            //archive mettings
            $archieveMetting = Meeting::where('status', 1)->whereDate('from_date', '<', date('Y-m-d'))->orderBy('id', 'DESC')

                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('hosted_by', 'LIKE', "%{$all['search']}%")
                        ->orWhere('meeting_number', 'LIKE', "%{$all['search']}%")
                        ->orWhere('members_present', 'LIKE', "%{$all['search']}%")
                        ->orWhere('created_at', 'LIKE', "%{$all['search']}%");
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
                        case "more than one year":
                            $filterData = Meeting::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                });

            $latestMettings = $latestMetting->paginate($pageLimit);
            $archieveMettings = $archieveMetting->paginate($pageLimit);

            $result = [];
            $result['latestMetting'] = $latestMettings;
            $result['archieveMetting'] = $archieveMettings;

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
            $all = json_decode($request->getContent(), true);
            $rules = array(
                'title' => 'required',
                'hosted_by' => 'required',
                'from_date' => 'required|date',
                'to_date' => 'required|date',
                'meeting_number' => 'required',
                'city' => 'required',
                'description' => 'required',
                'meeting_type' => 'required',
                'venue' => 'required',
                // 'wings' => 'required',
                // 'members' => 'required',
                // 'members_present' => 'required',
                // 'co_opted_bot' => 'required',
                // 'leave_of_absence' => 'required',
                // 'invocation' => 'required',
                // 'welcome_address' => 'required',
                'status' => 'required|bool',

            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $meetings = new Meeting();
                $meetings->title = $all['title'];
                $meetings->hosted_by = json_encode($all['hosted_by']);
                // $meetings->hosted_by = $all['hosted_by'];
                $meetings->from_date = $all['from_date'];
                $meetings->to_date = $all['to_date'];
                $meetings->meeting_number = $all['meeting_number'];
                $meetings->city = $all['city'];
                $meetings->description = $all['description'];
                $meetings->meeting_type = $all['meeting_type'];
                $meetings->venue = $all['venue'];
                $meetings->wings = json_encode($all['wings']);
                $meetings->members = json_encode($all['members']);
                $meetings->members_present = $all['members_present'] ? $all['members_present'] : null;
                $meetings->co_opted_bot = $all['co_opted_bot'] ? $all['co_opted_bot'] : null;
                $meetings->leave_of_absence = $all['leave_of_absence'] ? $all['leave_of_absence'] : null;
                $meetings->invocation = $all['invocation'] ? $all['invocation'] : null;
                $meetings->welcome_address = $all['welcome_address'] ? $all['welcome_address'] : null;
                $meetings->status = $all['status'];
                $meetings->created_by = $all['user_id'];
                $result = $meetings->save();

                $eventFeeds = new Feed();
                $eventFeeds->feed_name = $all['title'];
                $eventFeeds->event_hosted = json_encode($all['hosted_by']);
                $eventFeeds->discription = $all['description'];
                // $eventFeeds->feed_paths = $all['filePath'];
                $eventFeeds->user_id = $all['user_id'];

                if ($eventFeeds->save()) {
                    $string = json_decode(json_encode($all['wings']), true);
                    $wingMembers = WingMember::whereIn('wing_id', $string)->select('members')->get()->toArray(); //type array
                    $member = [];
                    if (!empty($wingMembers)) {
                        foreach ($wingMembers as $wingMember) {
                            $userIds = json_decode($wingMember['members'], true);
                            foreach ($userIds as $ids) {
                                array_push($member, $ids);
                            }
                        }
                        $new = json_decode(json_encode($all['members']), true); ///string type
                        foreach ($new as $id) {
                            array_push($member, $id);
                        }
                    }
                    $result = array_unique($member);
                    sort($result, SORT_NUMERIC);
                    $notifications = new Notification();
                    $notifications->notification_title = 'Metting ' . $all['title'] . ' created';
                    $notifications->notification_message = 'New Metting created on this date ' . date('D M-Y', strtotime($all['from_date'])) . " at " . $all['venue'];
                    $notifications->send_to = json_encode($result);
                    $notifications->created_by = $all['user_id'];
                    $result = $notifications->save();

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
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data insertion done']);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
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
            $meetings = Meeting::find($id);
            $result = [];
            $result['meetings'] = $meetings;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function manualArchieve($id)
    {
        try {
            //archieve mom manually by circular button in mom home page
            $latest = Meeting::where('id', $id)->where('status', 0)->update(['status' => 1]);
            $archieveMettings = Meeting::where('status', 1)->get();
            $result = [];
            $result['archieveMetting'] = $archieveMettings;
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
                'title' => 'required',
                'hosted_by' => 'required',
                'from_date' => 'required|date',
                'to_date' => 'required|date',
                'meeting_number' => 'required',
                'city' => 'required',
                'description' => 'required',
                'meeting_type' => 'required',
                'venue' => 'required',
                // 'wings' => 'required',
                // 'members' => 'required',
                // 'members_present' => 'required',
                // 'co_opted_bot' => 'required',
                // 'leave_of_absence' => 'required',
                // 'invocation' => 'required',
                // 'welcome_address' => 'required',
                'status' => 'required|bool',

            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $meetings = Meeting::find($id);
                $meetings->title = $all['title'];
                $meetings->hosted_by = json_encode($all['hosted_by']);
                $meetings->from_date = $all['from_date'];
                $meetings->to_date = $all['to_date'];
                $meetings->meeting_number = $all['meeting_number'];
                $meetings->city = $all['city'];
                $meetings->description = $all['description'];
                $meetings->meeting_type = $all['meeting_type'];
                $meetings->venue = $all['venue'];
                $meetings->wings = json_encode($all['wings']);
                $meetings->members = json_encode($all['members']);
                $meetings->members_present = $all['members_present'];
                $meetings->co_opted_bot = $all['co_opted_bot'];
                $meetings->leave_of_absence = $all['leave_of_absence'];
                $meetings->invocation = $all['invocation'];
                $meetings->welcome_address = $all['welcome_address'];
                $meetings->created_by = $all['user_id'];
                $meetings->status = $all['status'];
                $meetings->modified_by = $all['user_id'];

                $result = $meetings->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
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
            $meetings = Meeting::find($id);
            $meetings->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
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
                    $moreOne = Meeting::orderBy('id', 'DESC')->get();
                    break;
            }
            if ($all['filter'] == 'more than one year') {
                $result['more than one year'] = $moreOne;
            } else {
                $filter = Meeting::where('created_at', '>=', $filterData)->orderBy('id', 'DESC')->get();
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
            $result = Meeting::orderBy('id', 'DESC')
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
                        case "more than one year":
                            $filterData = Meeting::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                })->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function createMom(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $meeting_id = $all['id'];
            $meeting_data = Meeting::find($meeting_id);
            if ($meeting_data->mom_id == null) {
                $mom = new Mom();
                $mom->year = "";
                $mom->continuous = "";
                $mom->meeting_number = $meeting_data['meeting_number'];
                $mom->city = $meeting_data['city'];
                $mom->date_time = Carbon::today();
                $mom->meeting_type = $meeting_data['meeting_type'];
                $mom->event_type = "internal";
                $mom->venue = $meeting_data['venue'];
                $mom->wings = $meeting_data['wings'];
                $mom->members = $meeting_data['members'];
                $mom->members_present = "[]";
                $mom->co_opted_bot = "[]";
                $mom->leave_of_absence = "[]";
                // $mom->invocation = $meeting_data['invocation'];
                // $mom->welcome_address = $meeting_data['welcome_address'];
                $mom->content = null;
                $mom->events = null;
                $mom->created_by = $all['user_id'];
                $result = $mom->save();
                $meeting_data->mom_id = $mom->id;
                $meeting_data_save_result = $meeting_data->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'MOM created']);
            } else {
                return Response(['status' => 'error', 'statuscode' => 400, 'result' => 'MOM Already Exists'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
        }
    }
    public function latestTableData()
    {
        try {
            $result = Meeting::where('to_date', '>=', Carbon::today())
                ->orderBy('id', 'DESC')
                ->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function archiveTableData(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $result = Meeting::where('to_date', '<', Carbon::today())
                ->orderBy('id', 'DESC')
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
                    return $query->where('to_date', '>=', $filterData);
                })
                ->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function sendMeetingInviteMail($meeting_details)
    {
        try {
            $to_ids = array();
            $to_addresses = "";

            $hosts = "";

            $hosts_ids = json_decode($meeting_details['hosted_by'], true);
            if (is_array($hosts_ids)) {
                foreach ($hosts_ids as $host_id) {
                    if (is_numeric($host_id)) {
                        $host_details = User::find($host_id);
                        if ($host_details && $host_details['name']) {
                            if ($hosts == "") {
                                $hosts = $host_details['name'];
                            } else {
                                $hosts = $hosts . ", " . $host_details['name'];
                            }
                            if (!in_array($host_details['id'], $to_ids)) {
                                array_push($to_ids, $host_details['id']);
                                if ($to_addresses == "") {
                                    $to_addresses = $host_details['email'];
                                } else {
                                    $to_addresses = $to_addresses . ", " . $host_details['email'];
                                }
                            }
                        }
                    }
                }
            }

            $member_ids = json_decode($meeting_details['members'], true);
            if (is_array($member_ids)) {
                foreach ($member_ids as $member_id) {
                    if (is_numeric($member_id)) {
                        $member_details = User::find($member_id);
                        if ($member_details && $member_details['name']) {
                            if (!in_array($member_details['id'], $to_ids)) {
                                array_push($to_ids, $member_details['id']);
                                if ($to_addresses == "") {
                                    $to_addresses = $member_details['email'];
                                } else {
                                    $to_addresses = $to_addresses . ", " . $member_details['email'];
                                }
                            }
                        }
                    }
                }
            }

            $wing_ids = json_decode($meeting_details['wings'], true);
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
                                $to_addresses = $member_details['email'];
                            } else {
                                $to_addresses = $to_addresses . ", " . $member_details['email'];
                            }
                        }
                    }
                }
            }

            if ($meeting_details->meeting_type == "on_site") {
                $meeting_details->meeting_type = "on site";
            }

            $meeting_from_date_obj = date_create($meeting_details->from_date);
            $meeting_from_date = date_format($meeting_from_date_obj, "jS") . " of " . date_format($meeting_from_date_obj, "F") . " " . date_format($meeting_from_date_obj, "Y");
            $meeting_from_time = date_format($meeting_from_date_obj, "H:i A");

            $meeting_to_date_obj = date_create($meeting_details->to_date);
            $meeting_to_date = date_format($meeting_to_date_obj, "jS") . " of " . date_format($meeting_to_date_obj, "F") . " " . date_format($meeting_to_date_obj, "Y");
            $meeting_to_time = date_format($meeting_to_date_obj, "H:i A");

            // $meeting_banner = "https://admin.vcat.co.in/static/media/Eve.58a5279d87aaad927248.jpg";
            $meeting_banner = "https://vcat.co.in/staging/vcat-api/public/storage/document/1647946626.png";

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
                                                    Meeting Details</div>
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
                                                            src="' . $meeting_banner . '"
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
                                                        ' . $meeting_details['title'] . '
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
                                                        Below are the details for an upcoming meeting
                                                    </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        ' . $meeting_details['description'] . '
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
                                                        Meeting is scheduled on ' . $meeting_from_date . ' at ' . $meeting_from_time . ' and ends on ' . $meeting_to_date . ' at ' . $meeting_to_time . '. Venue is ' . $meeting_details['venue'] . '.</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        Meeting is hosted by ' . $hosts . '.</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        This is an ' . $meeting_details['meeting_type'] . ' meeting.</div>
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
                                                        ' . "We're looking forward for the meeting." . '
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
                                <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
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
                                                    <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:24px;text-align:left;text-transform:uppercase;color:#212b35;">
                                                        address</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                    <div
                                                        style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        No.9 Ground Floor, 9th Main, <br> 2nd Block Jayanagar, Bengaluru - 560011,
                                                        Karnataka, India</div>
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
                                            style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:570px;" ><![endif]-->
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
                                                            <td style="width:520px;">
                                                            <img alt height="auto"
                                                                src="https://admin.vcat.co.in/static/media/VCAT-location-map.png"
                                                                style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                                                width="520">
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

            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers .= 'From:VCAT<info@vcat.co.in>' . "\r\n";
            $subject = "VCAT Meeting: " . $meeting_details->title;
            $result = mail($to_addresses, $subject, $html_body, $headers);
            if ($result) {
                $result = ["to_addresses" => $to_addresses, "subject" => $subject, "headers" => $headers];
            }
            return $result;
        } catch (\Exception $e) {
            return "error" . $e->getMessage();
        }
    }
    public function notifyMeetingMembers($id)
    {
        try {
            $mail_result = false;
            $meeting_details = Meeting::find($id);
            if ($meeting_details) {
                // Mail Notification
                $mail_result = $this->sendMeetingInviteMail($meeting_details);
            }
            return Response([
                'status' => 'success',
                'statuscode' => 200,
                'result' => "Mail Sent",
                'mail_result' => $mail_result
            ]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
