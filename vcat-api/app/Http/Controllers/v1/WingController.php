<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Wing;
use App\Models\WingMember;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;

class WingController extends Controller
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
            // for pagination
            $currentPage = !empty($all['page']) ? $all['page'] : config('app.page');
            $pageLimit = !empty($all['size']) ? $all['size'] : config('app.limit');

            // setting the currentPage into Paginator
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });
            $wings = Wing::orderBy('id', 'DESC')->paginate($pageLimit);
            $result = [];
            $result['wings'] = $wings;
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
                // 'members' => 'required|string',
                'title' => 'required|string',
                // 'content' => 'required|string',
                // 'image' => 'required',
                // 'status' => 'required|boolean',
            );
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
            } else {
                $wings = new Wing();
                $wings->members = $all['members'];
                $wings->title = $all['title'];
                $wings->content = $all['content'];
                $wings->image = $all['image'];
                $wings->status = $all['status'];
                $wings->created_by = $all['user_id'];

                $result = $wings->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'inserted.']);
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

    //based on selecting  wing content change, members change in wings page
    public function show($id)
    {
        try {
            $wings = Wing::find($id);
            $wingMembers = WingMember::where('wing_id', $id)->select('id', 'wing_role', 'members')->get()->toArray();
            // get data user data from json
            if (!empty($wingMembers)) {
                foreach ($wingMembers as $key => $member) {
                    $userIds = json_decode($member['members'], true);
                    $users = User::whereIn('id', $userIds)->select('name', 'id', 'image')->get()->toArray();
                    $wingMembers[$key]['users'] = $users;
                }
            }

            $result = [];
            $result['wing'] = $wings;
            $result['wingMember'] = $wingMembers;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function showByid($id)
    {
        try {
            $wings = Wing::find($id);
            $result = [];
            $result['wings'] = $wings;
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
                // 'members' => 'required|string',
                // 'title' => 'required|string',
                // 'content' => 'required|string',
                // 'image' => 'required',
                // 'status' => 'required|boolean',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $wings = Wing::find($id);
                $wings->members = $all['members'];
                $wings->title = $all['title'];
                $wings->content = $all['content'];
                $wings->image = $all['image'];
                $wings->status = $all['status'];
                $wings->modified_by = $all['user_id'];

                $result = $wings->save();
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
            $wings = Wing::find($id);
            $wings->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    public function wingMembersAll()
    {
        try {
            $wingMembers = WingMember::all();
            $result = [];
            $result['wing_members'] = $wingMembers;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function wingMemberDrop(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $users = User::select('name', 'id')->get();

            $result = [];
            $result['members_dropdown'] = $users;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    // public function wingMemberStore(Request $request)
    // {
    //     try {
    //         $all = json_decode($request->getContent(), true);

    //         $rules = array(
    //             'wing_role' => 'required',
    //             'members' => 'required',
    //         );
    //         $Validator = Validator::make($all, $rules);
    //         if ($Validator->fails()) {
    //             return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
    //         } else {
    //             $data = $all['wing_role'];
    //             $members = $all['members'];
    //             foreach ($data as $key => $wingRoles) {
    //                 $membersList = $all['members'];
    //                 $wingMembers = new WingMember;
    //                 $wingMembers->wing_role = $wingRoles;
    //                 $wingMembers->members = $membersList[$key];
    //                 $wingMembers->wing_id = $all['wing_id'];
    //                 $wingMembers->created_by = $all['user_id'];
    //                 $result = $wingMembers->save();
    //             }
    //             return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'inserted.']);
    //         }
    //     } catch (\Exception$e) {
    //         return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
    //     }
    // }

    public function wingMemberUpdate(Request $request, $id)
    {
        // try {
        $all = json_decode($request->getContent(), true);

        $rules = array(
            'wing_role' => 'required',
            'members' => 'required',
        );
        $Validator = Validator::make($all, $rules);
        if ($Validator->fails()) {
            return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
        } else {
            // $wings = Wing::find($id);
            // $wings->title = $all['name'];
            // $wings->content = $all['description'];
            // $wings->image = $all['filePath'];
            // $wings->modified_by = $all['user_id'];
            // $result = $wings->save();

            $wingMembersList = $all['wing_member_id'];
            $membersList = $all['members'];
            // dd($membersList);
            foreach ($all['wing_role'] as $key => $wingRole) {
                // foreach ($data as $key => $rolesLists) {
                $membersList[$key];
                if (!empty($wingMembersList[$key])) {
                    $wingMembers = WingMember::find($wingMembersList[$key]);
                } else {
                    $wingMembers = new WingMember;
                }
                // dd($wingRole);
                $wingMembers->wing_role = $wingRole;
                $wingMembers->members = json_encode($membersList[$key]);
                $wingMembers->wing_id = $all['wing_id'];
                $wingMembers->modified_by = $all['user_id'];
                $result = $wingMembers->save();
                // }
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'updated.']);
        }
        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        // }
    }
    public function wingMemberShowByid($id)
    {
        try {
            $wingmembers = WingMember::find($id);
            $result = [];
            $result['wing_members'] = $wingmembers;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function wingMembersDestroy($id)
    {
        try {
            $wingMembers = WingMember::find($id);
            $wingMembers->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function tableData(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $result = Wing::orderBy('id', 'DESC')
                ->when(!empty($all['filter']), function ($query) use ($all) {
                    return $query->where('created_at', '<=', $all['filter']);
                })
                ->select('id', 'title', 'content', 'image')
                ->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function getWingMembers()
    {
        try {
            $wing_list = Wing::orderBy('id', 'DESC')
                ->select('id as value', 'title as label',)
                ->get();
            foreach ($wing_list as $wing) {
                $wing_members = array();
                $wing_members_list_result = WingMember::where('wing_id', '=', $wing->value)
                    ->select('members')->get();
                foreach ($wing_members_list_result as $wing_members_result) {
                    $members = json_decode($wing_members_result->members, true);
                    foreach ($members as $member) {
                        array_push($wing_members, $member);
                    }
                }
                $wing->members = array_unique($wing_members);
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $wing_list]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
