<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Mom;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;

class MomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            //latest mom
            $all = json_decode($request->getContent(), true);
            $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
            $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');
            // setting the currentPage into Paginator
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });
            $currentDate = date('Y-m-d');
            $moms = Mom::where('status', 0)->orderBy('id', 'DESC')->get()->toArray();
            if (!empty($moms)) {
                foreach ($moms as $mom) {
                    //archive carrier upload after six months automatically below condition
                    $momDate = date('Y-m-d', strtotime($mom['created_at'] . "+6 months"));
                    if ($currentDate == $momDate) {
                        Mom::where('id', $mom['id'])->update(['status' => 1]);
                    }
                }
            }
            $latestMetting = Mom::where('status', 0)->orderBy('id', 'DESC')

                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('date_time', 'LIKE', "%{$all['search']}%")
                        ->orWhere('content', 'LIKE', "%{$all['search']}%")
                        ->orWhere('city', 'LIKE', "%{$all['search']}%")
                        ->orWhere('modified_by', 'LIKE', "%{$all['search']}%")
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
                            $filterData = Mom::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                });

            $archieveMetting = Mom::where('status', 1)->orderBy('id', 'DESC')

                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('date_time', 'LIKE', "%{$all['search']}%")
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
                            $filterData = Mom::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                });
            $latestMettings = $latestMetting->paginate($pageLimit);
            $archieveMettings = $archieveMetting->paginate($pageLimit);

            $result = [];
            $result['latest_minutes_of_Metting'] = $latestMettings;
            $result['archieve_mom_six_months'] = $archieveMettings;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function manualArchieve($id)
    {
        try {
            //archieve mom manually by circular button in mom home page
            $latest = Mom::where('id', $id)->where('status', 0)->update(['status' => 1]);
            $archieveMettings = Mom::where('status', 1)->get();
            $result = [];
            $result['archieve_manual'] = $archieveMettings;
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
                // 'year' => 'required',
                // 'continuous' => 'required',
                // 'meeting_number' => 'required',
                // 'city' => 'required',
                // // 'date_time' => 'required|date',
                // 'meeting_type' => 'required',
                // // 'event_type' => 'required',
                // 'venue' => 'required',
                // 'wings' => 'required',
                // 'members' => 'required',
                // 'members_present' => 'required',
                // 'co_opted_bot' => 'required',
                // 'leave_of_absence' => 'required',
                // 'invocation' => 'required',
                // 'welcome_address' => 'required',
                // 'content' => 'required',
                // 'events' => 'required',
                // 'status' => 'required|bool',

            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $moms = new Mom();
                $moms->year = $all['year'];
                $moms->continuous = $all['continuous'];
                $moms->meeting_number = $all['meeting_number'];
                $moms->city = $all['city'];
                $moms->date_time = $all['date_time'];
                $moms->meeting_type = $all['meeting_type'];
                $moms->event_type = $all['event_type'];
                $moms->venue = $all['venue'];
                $moms->wings = json_encode($all['wings']);
                $moms->members = json_encode($all['members']);
                $moms->members_present = json_encode($all['members_present']);
                $moms->co_opted_bot = json_encode($all['co_opted_bot']);
                $moms->leave_of_absence = json_encode($all['leave_of_absence']);
                $moms->invocation = $all['invocation'];
                $moms->welcome_address = $all['welcome_address'];
                $moms->content = $all['content'];
                $moms->events = $all['events'];
                $moms->created_by = $all['user_id'];

                // $moms->status = $all['status'];
                $result = $moms->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data insertion done']);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
        }
    }
    public function allMom()
    {
        try {
            $moms = Mom::all();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $moms]);
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
            $moms = Mom::find($id);
            $result = [];
            $result['moms'] = $moms;
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
                'year' => 'required',
                'continuous' => 'required',
                'meeting_number' => 'required',
                'city' => 'required',
                'date_time' => 'required|date',
                'meeting_type' => 'required',
                'venue' => 'required',
                // 'wings' => 'required',
                // 'members' => 'required',
                // 'members_present' => 'required',
                // 'co_opted_bot' => 'required',
                // 'leave_of_absence' => 'required',
                'invocation' => 'required',
                // 'welcome_address' => 'required',
                // 'content' => 'required',
                'status' => 'required|bool',

            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $moms = Mom::find($id);
                $moms->year = $all['year'];
                $moms->continuous = $all['continuous'];
                $moms->meeting_number = $all['meeting_number'];
                $moms->city = $all['city'];
                $moms->date_time = $all['date_time'];
                $moms->meeting_type = $all['meeting_type'];
                $moms->venue = $all['venue'];
                $moms->wings = json_encode($all['wings']);
                $moms->members = json_encode($all['members']);
                $moms->members_present = json_encode($all['members_present']);
                $moms->co_opted_bot = json_encode($all['co_opted_bot']);
                $moms->leave_of_absence = json_encode($all['leave_of_absence']);
                $moms->invocation = $all['invocation'];
                $moms->welcome_address = $all['welcome_address'];
                $moms->content = $all['content'];
                $moms->status = $all['status'];
                $moms->modified_by = $all['user_id'];

                $result = $moms->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $moms]);
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
            $moms = Mom::find($id);
            $moms->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function eventsDrop(Request $request)
    {
        try {
            $events = Event::where('status', 0)->whereDate('from_date', '<', date('Y-m-d'))->select('name', 'id')->get();
            $result = [];
            $result['event_dropdown'] = $events;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function search(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $search = $all['search'];

            $allUsers = Mom::all();
            $tagKeyword = Mom::where('date_time', 'LIKE', "%{$search}%")
                ->orWhere('meeting_number', 'LIKE', "%{$search}%")
                ->orWhere('members_present', 'LIKE', "%{$search}%")
                ->orWhere('created_at', 'LIKE', "%{$search}%")
                ->get();
            $result = [];
            // $result['all_files'] = $allAttachments;
            $result['Keyword_search'] = $tagKeyword;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
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
                    $moreOne = Mom::orderBy('id', 'DESC')->get();
                    break;
            }
            if ($all['filter'] == 'more than one year') {
                $result['more than one year'] = $moreOne;
            } else {
                $filter = Mom::where('created_at', '>=', $filterData)->orderBy('id', 'DESC')->get();
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
            $result = Mom::orderBy('id', 'DESC')
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
                            $filterData = Mom::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                })->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function latestTableData()
    {
        try {
            $result = Mom::where('is_approved', '=', "0")
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
            $result = Mom::where('is_approved', '=', "1")
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
                    return $query->where('created_at', '>=', $filterData);
                })->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function approveMom(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            if ($all['id']) {
                $mom_data = Mom::find($all['id']);
                if ($mom_data) {
                    $mom_data->is_approved = 1;
                    $mom_data->modified_by = $all['user_id'];
                    $result = $mom_data->save();
                    return Response(['status' => 'success', 'statuscode' => 200, 'result' => "Requested MOM is approved"]);
                }
            }
            return Response(['status' => 'error', 'statuscode' => 400, 'result' => 'MOM not found'], 400);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
