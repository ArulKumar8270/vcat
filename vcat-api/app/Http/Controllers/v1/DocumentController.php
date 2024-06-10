<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Carrier;
use App\Models\Category;
use App\Models\Document;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
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
            //latest documents uploads   if selected all documents this api
            $documents = Document::where('is_archive', 0)->orderBy('id', 'DESC')->get()->toArray();
            if (!empty($documents)) {
                foreach ($documents as $document) {
                    $documentDate = date('Y-m-d', strtotime($document['created_at'] . "+6 months"));
                    if ($currentDate == $documentDate) {
                        Document::where('id', $document['id'])->update(['is_archive' => 1]);
                    }
                }
            }
            $recentUpload = Document::where('is_archive', 0)->orderBy('id', 'DESC')
                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('created_at', 'LIKE', "%{$all['search']}%")
                        ->orWhere('file_name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('tags', 'LIKE', "%{$all['search']}%");
                })
                ->when(!empty($all['category_id']), function ($query) use ($all) {
                    return $query->where('category_id', $all['category_id'])->where('is_archive', 0)->orderBy('id', 'DESC');
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
            $archiveUpload = Document::Where('is_archive', 1)->orderBy('id', 'DESC')
                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('created_at', 'LIKE', "%{$all['search']}%")
                        ->orWhere('file_name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('tags', 'LIKE', "%{$all['search']}%");
                })
                ->when(!empty($all['category_id']), function ($query) use ($all) {
                    return $query->where('category_id', $all['category_id'])->Where('is_archive', 1)->orderBy('id', 'DESC');
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
            $archiveUploads = $archiveUpload->paginate($pageLimit);

            $result = [];
            $result['recentUpload'] = $recentUploads;
            $result['archieveUploads'] = $archiveUploads;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function manualArchive($id)
    {
        try {
            //archive carrier manually by circular button in carrier home page
            $latest = Document::where('id', $id)->where('is_archive', 0)->update(['is_archive' => 1]);
            $archiveUploads = Document::where('is_archive', 1)->get();
            $result = [];
            $result['archieveUploads'] = $archiveUploads;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
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
    public function showByCategory(Request $request, $id)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
            $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');
            // setting the currentPage into Paginator
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });
            //if selected dropdown categories this api
            //intension is based dropdown selection get data that dropdown is categories
            $currentDate = date('Y-m-d');
            $documents = Document::where('category_id', $id)->where('is_archive', 0)->orderBy('id', 'DESC')->get()->toArray();
            if (!empty($documents)) {
                foreach ($documents as $document) {
                    $documentDate = date('Y-m-d', strtotime($document['created_at'] . "+6 month"));
                    if ($currentDate == $documentDate) {
                        Document::where('id', $document['id'])->update(['is_archive' => 1]);
                    }
                }
            }
            $recentUploads = Document::where('category_id', $id)->where('is_archive', 0)->orderBy('id', 'DESC')->paginate($pageLimit);

            //archive document upload after six months automatically
            $archiveUploads = Document::where('category_id', $id)->Where('is_archive', 1)->orderBy('id', 'DESC')->paginate($pageLimit);

            $result = [];
            $result['recentUploads'] = $recentUploads;
            $result['archieveUploads'] = $archiveUploads;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
        }
    }
    public function search(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $search = $all['search'];

            $tagKeyword = Document::where('created_at', 'LIKE', "%{$search}%")
                ->orWhere('file_name', 'LIKE', "%{$search}%")
                ->orWhere('tags', 'LIKE', "%{$search}%")
                ->get();
            $result = [];
            $result['Keyword_tag_create_file_search'] = $tagKeyword;
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

    public function Store(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);

            $rules = array(
                // 'discription' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $documents = new Document();
                $documents->category_id = $all['cat_id'];
                $documents->document_path = $all['filePath'];
                $documents->created_by = $all['user_id'];
                $documents->file_name = $all['file_name'];

                $result = $documents->save();

                // $documents->file_name = $all['file_name'];
                // $documents->tags = $request['tags'];
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data insertion done']);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $documents = Document::find($id);
            $result = [];
            $result['documents'] = $documents;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function allDocuments()
    {
        try {
            $documents = Document::all();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $documents]);
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
        //
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
            $documents = Document::find($id);
            $documents->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'document has been deleted success']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    public function categoryAdd(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $rules = array(
                'name' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
            } else {
                $categories = Category::create([
                    'name' => $all['name'],
                    'created_by' => $all['user_id'],

                ]);

                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'new category created.']);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function categoryDrop(Request $request)
    {
        try {
            $categories = Category::select('name', 'id')->get();
            $result = [];
            $result['categories_dropdown'] = $categories;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function updateCategory(Request $request, $id)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $rules = array(
                'name' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
            } else {
                $categories = Category::find($id);
                $categories->name = $all['name'];
                $categories->modified_by = $all['user_id'];

                $result = $categories->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $categories]);
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
        }
    }
    public function destroyCategory($id)
    {
        try {
            $carriers = Category::find($id);
            $carriers->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'Category has been deleted success']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function showCategory($id)
    {
        try {
            $categories = Category::find($id);
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $categories]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function Filter(Request $request)
    {
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
                    $moreOne = Document::orderBy('id', 'DESC')->get();
                    break;
            }
            if ($all['filter'] == 'more than one year') {
                $result['more than one year'] = $moreOne;
            } else {
                $filter = Document::where('created_at', '>=', $filterData)->orderBy('id', 'DESC')->get();
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
            $result = Document::orderBy('id', 'DESC')
                ->when(!empty($all['category_id']), function ($query) use ($all) {
                    return $query->where('category_id', $all['category_id']);
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
                })
                ->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
