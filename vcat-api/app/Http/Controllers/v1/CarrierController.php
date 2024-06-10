<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Carrier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;

class CarrierController extends Controller
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

            $currentDate = date('Y-m-d');
            $carriers = Carrier::where('is_archive', 0)->orderBy('id', 'DESC')->get()->toArray();
            if (!empty($carriers)) {
                foreach ($carriers as $carrier) {
                    //archive carrier upload after six months automatically below condition
                    $carrierDate = date('Y-m-d', strtotime($carrier['created_at'] . "+6 months"));
                    if ($currentDate == $carrierDate) {
                        Carrier::where('id', $carrier['id'])->update(['is_archive' => 1]);
                    }
                }
            }
            $recentUpload = Carrier::where('is_archive', 0)->orderBy('id', 'DESC')

                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('job_title', 'LIKE', "%{$all['search']}%")
                        ->orWhere('tags', 'LIKE', "%{$all['search']}%")
                        ->orWhere('company_name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('job_type', 'LIKE', "%{$all['search']}%")
                        ->orWhere('date_time', 'LIKE', "%{$all['search']}%");
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
                            $filterData = Carrier::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                });

            $archieveUpload = Carrier::Where('is_archive', 1)->orderBy('id', 'DESC')
                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('job_title', 'LIKE', "%{$all['search']}%")
                        ->orWhere('tags', 'LIKE', "%{$all['search']}%")
                        ->orWhere('company_name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('job_type', 'LIKE', "%{$all['search']}%")
                        ->orWhere('date_time', 'LIKE', "%{$all['search']}%");
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
                            $filterData = Carrier::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                });

            $recentUploads = $recentUpload->paginate($pageLimit);
            $archieveUploads = $archieveUpload->paginate($pageLimit);

            $result = [];
            $result['recentUpload'] = $recentUploads;
            $result['archieveUploads'] = $archieveUploads;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function manualArchive($id)
    {
        try {
            //archieve carrier manually by circular button in carrier home page
            $latest = Carrier::where('id', $id)->where('is_archive', 0)->update(['is_archive' => 1]);
            $archieveUploads = Carrier::where('is_archive', 1)->orderBy('id', 'DESC')->get();
            $result = [];
            $result['archieveUploads_manual'] = $archieveUploads;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function allCarrier()
    {
        try {
            $carriers = Carrier::all();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $carriers]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function search(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $search = $all['search'];
            $allAttachments = Carrier::all();
            $tagKeyword = Carrier::where('job_title', 'LIKE', "%{$search}%")
                ->orWhere('tags', 'LIKE', "%{$search}%")
                ->orWhere('company_name', 'LIKE', "%{$search}%")
                ->orWhere('job_type', 'LIKE', "%{$search}%")
                ->orWhere('date_time', 'LIKE', "%{$search}%")
                ->get();
            $result = [];
            // $result['all_files'] = $allAttachments;
            $result['Keyword_search'] = $tagKeyword;

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
                'job_title' => 'required',
                'company_name' => 'required',
                'job_type' => 'required',
                'date_time' => 'required|date',
                'salary' => 'required',
                'salary_type' => 'required',
                'location' => 'required',
                // 'job_description' => 'required',
                // 'requirements' => 'required',
                // 'about_company' => 'required',
                // 'is_archive' => 'required|bool',

            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $carriers = new Carrier();
                $carriers->job_title = $all['job_title'];
                $carriers->company_name = $all['company_name'];
                $carriers->job_type = $all['job_type'];
                $carriers->date_time = $all['date_time'];
                $carriers->salary = $all['salary'];
                $carriers->salary_type = $all['salary_type'];
                $carriers->location = $all['location'];
                $carriers->job_description = $all['job_description'];
                $carriers->requirements = $all['requirements'];
                $carriers->about_company = $all['about_company'];
                $carriers->image = $all['filePath'];
                $carriers->tags = json_encode($all['tags']);
                $carriers->created_by = $all['user_id'];

                // $carriers->status = $all['status'];
                $result = $carriers->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'carrier insertion done']);
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
            $carriers = Carrier::find($id);
            $result = [];
            $result['carriers'] = $carriers;
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
            'job_title' => 'required',
            'company_name' => 'required',
            'job_type' => 'required',
            'date_time' => 'required|date',
            'salary' => 'required',
            'salary_type' => 'required',
            'location' => 'required',
            'job_description' => 'required',
            'requirements' => 'required',
            'about_company' => 'required',

        );
        $Validator = Validator::make($all, $rules);
        if (!$Validator->passes()) {
            return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
        } else {
            $carriers = Carrier::find($id);
            $carriers->job_title = $all['job_title'];
            $carriers->company_name = $all['company_name'];
            $carriers->job_type = $all['job_type'];
            $carriers->date_time = $all['date_time'];
            $carriers->salary = $all['salary'];
            $carriers->salary_type = $all['salary_type'];
            $carriers->location = $all['location'];
            $carriers->job_description = $all['job_description'];
            $carriers->requirements = $all['requirements'];
            $carriers->about_company = $all['about_company'];
            $carriers->image = $all['filePath'];
            $carriers->tags = json_encode($all['tags']);
            $carriers->modified_by = $all['user_id'];

            $result = $carriers->save();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $carriers]);
        }
        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
        // }
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
            $carriers = Carrier::find($id);
            $carriers->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'carrier has been deleted success']);
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
                    $moreOne = Carrier::orderBy('id', 'DESC')->get();
                    break;
            }
            if ($all['filter'] == 'more than one year') {
                $result['more than one year'] = $moreOne;
            } else {
                $filter = Carrier::where('created_at', '>=', $filterData)->orderBy('id', 'DESC')->get();
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
            $result = Carrier::orderBy('id', 'DESC')
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
    public function tableDataPersonalized(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $user_id = $all['user_id'];
            $result = Carrier::where('created_by', $user_id)
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
}
