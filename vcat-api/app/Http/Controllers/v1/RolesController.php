<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\RolePermission;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Validator;

class RolesController extends Controller
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
            $role = Role::orderBy('id', 'DESC')

                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query
                        ->where('name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('id', 'LIKE', "%{$all['search']}%")
                        ->orWhere('created_at', 'LIKE', "%{$all['search']}%")
                        ->orWhere('is_active', 'LIKE', "%{$all['search']}%");
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
            $roles = $role->paginate($pageLimit);

            $result = [];
            $result['roles'] = $roles;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $roles]);
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
        // try {
        $all = json_decode($request->getContent(), true);

        $rules = array(
            // 'name' => 'required|max:255',
            // // 'description' => 'required|max:255',
            // 'is_active' => 'required',
            // 'created_by' => 'required',
        );
        $Validator = Validator::make($all, $rules);
        if (!$Validator->passes()) {
            return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
        } else {
            $roles = new Role();
            $roles->name = $all['name'];
            $roles->description = $all['description'];
            $roles->created_by = $all['user_id'];
            // $roles->is_active = $all['is_active'];
            $result = $roles->save();

            $permissionIDs = $all['permission_id'];
            if (!empty($permissionIDs)) {
                foreach ($permissionIDs as $permissionID) {
                    $rolePermissions = new RolePermission();
                    $rolePermissions->role_id = $roles->id;
                    $rolePermissions->permission_id = $permissionID;
                    $rolePermissions->is_deleted = '0';
                    $rolePermissions->created_by = $all['user_id'];
                    $permissions = $rolePermissions->save();
                }
            }

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data insertion done.']);
        }
        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()],500);
        // }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function show($id)
    // {
    //     try
    //     {
    //         $roles = Role::find($id);
    //         $rolesPermissions = RolePermission::where('role_id', $id)->select('id', 'role_id', 'permission_id', 'is_deleted')->get();
    //         $result = [];
    //         $result['roles'] = $roles;
    //         $result['rolesPermissions'] = $rolesPermissions;

    //         return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
    //     } catch (\Exception$e) {
    //         return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
    //     }
    // }
    public function show($id)
    {
        try {
            $roles = Role::find($id);

            // $rolesPermissions = RolePermission::join('permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            //     ->where('role_permissions.role_id', $id)->select('role_permissions.permission_id', 'role_permissions.role_id', 'permissions.name', 'is_deleted')->get();
            $rolesPermissionsResult = RolePermission::where('role_permissions.role_id', $id)
                ->select('role_permissions.permission_id')
                ->get();
            $rolesPermissions = array();
            if (!empty($rolesPermissionsResult)) {
                foreach ($rolesPermissionsResult as $rolesPermission) {
                    if (!empty($rolesPermission['permission_id'])) {
                        array_push($rolesPermissions, $rolesPermission['permission_id']);
                    }
                }
            }
            $result = [];
            $result['roles'] = $roles;
            $result['rolesPermissions'] = $rolesPermissions;

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
            // 'description' => 'required|max:255',
            // 'is_active' => 'required',
            // 'modified_by' => 'required',
        );
        $Validator = Validator::make($all, $rules);
        if (!$Validator->passes()) {
            return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
        } else {
            $permissionIDs = $all['permission_id'];
            $roles = Role::find($id);
            $roles->name = $all['name'];
            $roles->description = $all['description'];
            $roles->is_active = $all['is_active'];
            $roles->modified_by = $all['user_id'];
            $result = $roles->save();

            $Permissions = RolePermission::where('role_id', $id)->select('id', 'permission_id', 'role_id')->get()->toArray();
            $allPermissions = [];
            foreach ($Permissions as $Permission) {
                $list = $Permission['permission_id'];
                array_push($allPermissions, $list);
            }
            // dd($allPermissions);
            $addPermissions = array_diff($permissionIDs, $allPermissions);
            $deletePermissions = array_diff($allPermissions, $permissionIDs);
            // dd($DeletePermissions);
            foreach ($addPermissions as $addPermission) {
                $rolePermissions = new RolePermission();
                $rolePermissions->role_id = $id;
                $rolePermissions->modified_by = $all['user_id'];
                $rolePermissions->permission_id = $addPermission;
                $result = $rolePermissions->save();
            }
            $deletingPermissions = RolePermission::where('role_id', $id)->whereIn('permission_id', $deletePermissions)->select('id')->get()->toArray();
            foreach ($deletingPermissions as $deletingPermission) {
                $deletePer = RolePermission::find($deletingPermission);
                // if (!empty($deletePer)) {
                $deletePer->each->delete();
                // }
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'updated done..']);
        }
        // } catch (\Exception$e) {
        //     return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        // }
    }

    //this dropdown for users for selecting role and assign permissions select role
    public function rolesDrop(Request $request)
    {
        try {
            // $rolesDrop = Role::select('name', 'id')->get();
            $rolesDrop = Role::where('is_active', 0)->select('name', 'id')->get();
            $result = [];
            $result['roles_dropdown'] = $rolesDrop;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
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
            $roles = Role::find($id);
            $roles->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function tableData(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $result = Role::orderBy('id', 'DESC')
                ->when(!empty($all['filter']), function ($query) use ($all) {
                    return $query->where('created_at', '<=', $all['filter']);
                })
                ->select('id', 'name', 'is_active', 'created_at')
                ->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
