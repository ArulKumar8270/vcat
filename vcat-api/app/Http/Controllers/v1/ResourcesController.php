<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;

class ResourcesController extends Controller
{
    public function index(Request $request)
    {
        try
        {
            $all = json_decode($request->getContent(), true);
            $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
            $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');
            // setting the currentPage into Paginator
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });
            $latestResource = Resource::orderBy('id', 'DESC')

                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('subject', 'LIKE', "%{$all['search']}%")
                        ->orWhere('topic', 'LIKE', "%{$all['search']}%")
                        ->orWhere('speaker', 'LIKE', "%{$all['search']}%")
                        ->orWhere('link', 'LIKE', "%{$all['search']}%")
                        ->orWhere('document', 'LIKE', "%{$all['search']}%");
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
                            $filterData = Resource::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                });
            $archiveResource = Resource::where('is_archive', 1)->orderBy('id', 'DESC')
                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('subject', 'LIKE', "%{$all['search']}%")
                        ->orWhere('topic', 'LIKE', "%{$all['search']}%")
                        ->orWhere('speaker', 'LIKE', "%{$all['search']}%")
                        ->orWhere('link', 'LIKE', "%{$all['search']}%")
                        ->orWhere('document', 'LIKE', "%{$all['search']}%");
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
                            $filterData = Resource::orderBy('id', 'DESC')->get();
                            break;
                    }
                    return $query->where('created_at', '>=', $filterData);
                });

            $latestResources = $latestResource->paginate($pageLimit);
            $archiveResources = $archiveResource->paginate($pageLimit);

            $result = [];
            $result['latestResources'] = $latestResources;
            $result['archieveResources'] = $archiveResources;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception$e) {
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
                // 'subject' => 'required',
                // 'topic' => 'required',
                // 'speaker' => 'required',
                // 'document' => 'required',
                // 'link' => 'required',

            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $resources = new Resource();
                $resources->subject = $all['subject'];
                $resources->topic = $all['topic'];
                $resources->speaker = $all['speaker'];
                $resources->document = $all['filePath'];
                $resources->link = $all['link'];
                $resources->type = $all['type'];
                // $resources->is_archive = $all['is_archive'];
                $resources->created_by = $all['user_id'];
                $result = $resources->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data insertion done']);
            }
        } catch (\Exception$e) {
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
        try
        {
            $resources = Resource::find($id);
            $result = [];
            $result['resources'] = $resources;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function manualArchive($id)
    {
        try
        {
            //archive mom manually by circular button in mom home page
            $latest = Resource::where('id', $id)->where('status', 0)->update(['status' => 1]);
            $archiveResources = Resource::where('status', 1)->get();
            $result = [];
            $result['archieveResources'] = $archiveResources;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception$e) {
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
                // 'subject' => 'required',
                // 'topic' => 'required',
                // 'speaker' => 'required',
                // 'document' => 'required',
                // 'link' => 'required',

            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $resources = Resource::find($id);
                $resources->subject = $all['subject'];
                $resources->topic = $all['topic'];
                $resources->speaker = $all['speaker'];
                $resources->document = $all['filePath'];
                $resources->link = $all['link'];
                $resources->type = $all['type'];
                // $resources->is_archive = $all['is_archive'];
                $resources->created_by = $all['user_id'];
                $result = $resources->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
            }
        } catch (\Exception$e) {
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
        try
        {
            $resources = Resource::find($id);
            $resources->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted success']);
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function tableData(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $result = Resource::orderBy('id', 'DESC')
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
                })
                ->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function publicData()
    {
        try
        {
            $result = Resource::where("type", "=", 'public')
            ->orderBy('id', 'DESC')
            ->select('id','subject','topic','link','document','speaker')
            ->get();

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
