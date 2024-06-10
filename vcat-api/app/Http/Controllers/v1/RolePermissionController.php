<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\RolePermission;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;

class RolePermissionController extends Controller
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

            $rolePermission = RolePermission::join('roles', 'role_permissions.role_id', '=', 'roles.id')
                ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
                ->select('role_permissions.id', 'role_permissions.is_deleted', 'role_permissions.role_id', 'role_permissions.permission_id', 'roles.name as role_name', 'permissions.name as permission_name')
                ->orderBy('role_permissions.id', 'DESC')

                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('role_permissions.id', 'LIKE', "%{$all['search']}%")
                        ->orWhere('role_permissions.is_deleted', 'LIKE', "%{$all['search']}%")
                        ->orWhere('role_permissions.role_id', 'LIKE', "%{$all['search']}%")
                        ->orWhere('roles.name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('permissions.name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('role_permissions.permission_id', 'LIKE', "%{$all['search']}%");
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

                    return $query->where('role_permissions.created_at', '>=', $filterData);
                });
            $rolePermissions = $rolePermission->paginate($pageLimit);

            $result = [];
            $result['rolePermissions'] = $rolePermissions;
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
    //selva code ///////////////////////////////////////////////
    // public function store(Request $request, $user_id)
    // {
    //     {
    //         // try {
    //         $rules = array(
    //             //'permission_id' => 'required',
    //             //'is_deleted' => 'required',

    //         );
    //         $Validator = Validator::make($request->all(), $rules);
    //         if ($Validator->fails()) {
    //return response()->json(["status" => "failed", "message" => "Validation error", "errors" => $Validator->errors()], 400);
    //         } else {
    //             $permissions = json_decode($request->permission_id, true);
    //             $delete = json_decode($request->is_deleted, true);
    //             $userRoleid = User::where('id', $user_id)->first();
    //             $role_id = $userRoleid->role_id;

    //             if (!empty($delete)) {
    //                 $isDeleted = RolePermission::Where('role_id', $role_id)->where('is_deleted', 0)->WhereIn('permission_id', $delete)->get();
    //                 $allDeletedIds = [];
    //                 //
    //                 if (!empty($isDeleted)) {
    //                     foreach ($isDeleted as $deleted) {
    //                         $allDeletedIds . array_push($deleted->permission_id);
    //                         if (!in_array($delete, $deleted->permission_id)) {
    //                             $rolePermissions = new RolePermission();
    //                             $rolePermissions->role_id = $role_id;
    //                             $rolePermissions->permission_id = $permission_id;
    //                             $rolePermissions->created_by = $user_id;
    //                             $rolePermissions->is_deleted = 0;
    //                             $result = $rolePermissions->save();
    //                         }
    //                     }
    //                 }

    //                 $needToDelete = array_diff($delete, $allDeletedIds);
    //                 foreach ($needToDelete as $deleteRecode) {
    //                     $rolePermissions = new RolePermission();
    //                     $rolePermissions->role_id = $role_id;
    //                     $rolePermissions->permission_id = $deleteRecode;
    //                     $rolePermissions->created_by = $user_id;
    //                     $rolePermissions->is_deleted = 0;
    //                     $result = $rolePermissions->save();
    //                 }

    //                 $undoDelete = array_diff($delete, $allDeletedIds);
    //                 foreach ($undoDelete as $undoDel) {
    //                     $rolePermissions = new RolePermission();
    //                     // $rolePermissions->role_id = $role_id;
    //                     $rolePermissions->role_id = $role_id;
    //                     $rolePermissions->permission_id = $undoDel;
    //                     $rolePermissions->created_by = $user_id;
    //                     $rolePermissions->is_deleted = 1;
    //                     $result = $rolePermissions->save();
    //                 }

    //                 $response = ['status' => 'error', 'statuscode' => 200, 'result' => 'done'];
    //                 // return Response($response);
    //                 // }
    //             }
    //             if (count($permissions) > 0) {
    //                 foreach ($permissions as $permission) {
    //                     $record = RolePermission::where('permission_id', $permission)->first();
    //                     if (empty($record)) {
    //                         $rolePermissions = new RolePermission();
    //                         $rolePermissions->role_id = $role_id;
    //                         $rolePermissions->permission_id = $permission;
    //                         $rolePermissions->created_by = $user_id;
    //                         // $rolePermissions->is_deleted = 1;
    //                         $result = $rolePermissions->save();
    //                     }
    //                 }
    //             }
    //             return Response(['status' => 'sucess', 'statuscode' => 200, 'result' => 'new permissions created sucessfully.']);

    //         }
    //         // } catch (\Exception$e) {
    //         //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()]);
    //         // }
    //     }
    // }
    //admin can destroy the selcted permissions
    public function store(Request $request, $user_id)
    {

        // try {
        $all = json_decode($request->getContent(), true);

        $rules = array(
            // 'permission_id' => 'required',
        );
        $Validator = Validator::make($request->all(), $rules);
        if (!$Validator->passes()) {
            return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
        } else {
            $permissions = $request->permission_id;
            $is_deleted = $request->is_deleted;
            // $userRoleid = User::where('id', $user_id)->first();
            // $role_id = $userRoleid->role_id;
            $role_id = $all['role_id'];
            $allPermission = RolePermission::Where('role_id', $role_id)->where('is_deleted', 0)->WhereIn('permission_id', $permissions)->get();

            if ($permissions != $allPermission) {
                $plucked = RolePermission::pluck('permission_id');
                $database = $plucked->all();
                $yourArray = array_map('intval', $database);
                $differenceArrays = array_diff($permissions, $yourArray);
                foreach ($differenceArrays as $differenceArray) {
                    $rolePermissions = new RolePermission();
                    $rolePermissions->role_id = $role_id;
                    $rolePermissions->permission_id = $differenceArray;
                    $rolePermissions->created_by = $user_id;
                    $result = $rolePermissions->save();
                }
                if (empty($is_deleted)) {
                    // is_deleted array is empty means allow permissions where permission 0 to 1 (o means allow permissions)
                    $rolePermission = RolePermission::Where('role_id', $role_id)->where('is_deleted', 1)->WhereIn('permission_id', $permissions)->update(['is_deleted' => 0]);
                } else {
                    $sameValues = array_intersect($is_deleted, $permissions);
                    if ($sameValues == true) {
                        return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'check either allow or denied'], 400);
                    }
                    $deletable = array_intersect($is_deleted, $yourArray); // means in two arrays get how many values are same ex:[12345][12367] result[123]
                    $deletableOppsite = array_diff($yourArray, $is_deleted);
                    $rolePermission = RolePermission::Where('role_id', $role_id)->WhereIn('permission_id', $deletable)->update(['is_deleted' => 1]);
                    $rolePermission = RolePermission::Where('role_id', $role_id)->WhereIn('permission_id', $deletableOppsite)->update(['is_deleted' => 0]);
                }

                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'sucessfully Updated'], 200);
            }
        }
        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        // }
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
            $rolePermissions = RolePermission::find($id);
            $result = [];
            $result['rolePermissions'] = $rolePermissions;

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
                'role_id' => 'required',
                'permission_id' => 'required',
                'modified_by' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $rolePermissions = RolePermission::find($id);
                $rolePermissions->role_id = $all['role_id'];
                $rolePermissions->permission_id = $all['permission_id'];
                $rolePermissions->modified_by = $all['user_id'];
                $result = $rolePermissions->save();
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $rolePermissions]);
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
            $rolePermissions = RolePermission::find($id);
            $rolePermissions->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function tableData(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $result = RolePermission::join('roles', 'role_permissions.role_id', '=', 'roles.id')
                ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
                ->select('role_permissions.id', 'role_permissions.is_deleted', 'role_permissions.role_id', 'role_permissions.permission_id', 'roles.name as role_name', 'permissions.name as permission_name')
                ->orderBy('role_permissions.id', 'DESC')
                ->when(!empty($all['filter']), function ($query) use ($all) {
                    return $query->where('role_permissions.created_at', '<=', $all['filter']);
                })
                ->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
