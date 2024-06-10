<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Invitation;
use App\Models\Meeting;
use App\Models\Role;
use App\Models\User;
use App\Models\Wing;
use App\Models\WingMember;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;

class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function allUsers(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $users = User::orderBy('id', 'DESC')
                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query->where('name', 'LIKE', "%{$all['search']}%");
                })->select('id', 'name', 'image', 'role_id', 'created_by')->get();
            $result = [];
            $result['all_users'] = $users;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

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

            $user = User::orderBy('id', 'DESC')
                ->when(!empty($all['search']), function ($query) use ($all) {
                    return $query
                        ->where('id', 'LIKE', "%{$all['search']}%")
                        ->orWhere('name', 'LIKE', "%{$all['search']}%")
                        ->orWhere('icai_membership_no', 'LIKE', "%{$all['search']}%")
                        // ->orWhere('email', 'LIKE', "%{$all['search']}%")
                        ->orWhere('mobile_number', 'LIKE', "%{$all['search']}%")
                        // ->orWhere('created_at', 'LIKE', "%{$all['search']}%")
                    ;
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

            $users = $user->paginate($pageLimit);
            $result = [];
            $result['users'] = $users;
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
        // try {
        $all = json_decode($request->getContent(), true);
        $rules = array(
            'name' => 'required|string|max:255',
            // 'icai_membership_no' => 'required|string|max:255',
            // 'nominee_name' => 'required|string|max:255',
            // 'qualification' => 'required|string|max:255',
            // 'dob' => 'required|date',
            // 'blood_group' => 'required|string|max:255',
            // 'occupation' => 'required|string|max:255',
            // 'communication_address' => 'required',
            // 'office_address' => 'required|string',
            // 'residence_address' => 'required',
            // 'office_mobile' => 'required|numeric|min:10|unique:users',
            // 'mobile_number' => 'required|numeric|min:10|unique:users',
            'mobile_number' => 'required|numeric|min:10',
            // 'spouse_name' => 'required|string',
            // 'spouse_dob' => 'required|date',
            // 'marriage_date' => 'required|date',
            // 'nos_children' => 'required|integer',
            // 'children_name_1' => 'required|string',
            // 'children_name_2' => 'required|string',
            // 'children_name_3' => 'required|string',
            // 'associate_org_member' => 'required|string',
            // 'associate_org_position' => 'required|string',
            // 'become' => 'required|string',
            // 'payment_type' => 'required|string',
            //////
            // 'role_id' => 'required|string',
            // 'email' => 'required|email|unique:users',
            'email' => 'required|email',
            // 'discription' => 'string',
            // 'option_1' => 'string',
            // 'password' => ['required', 'string', Password::min(8)->mixedCase()->symbols()],
            // 'status' => 'required|bool',
            // 'image' => 'required',
            // 'wings' => 'required',
        );
        $Validator = Validator::make($all, $rules);
        if (!$Validator->passes()) {
            return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
        } else {
            $email_check = User::where('email', '=', $all['email'])->get();
            $phone_check = User::where('mobile_number', '=', $all['mobile_number'])->get();
            if (($email_check && count($email_check) != 0) || ($phone_check && count($phone_check) != 0)) {
                $errors = [];
                if ($email_check && count($email_check) != 0) {
                    $errors['email'] = ["The email has already been taken."];
                }
                if ($phone_check && count($phone_check) != 0) {
                    $errors['mobile_number'] = ["The mobile number has already been taken."];
                }
                return response()->json(['status' => '0', 'error' => $errors]);
            }
            // $random = str_shuffle('DezignCode@123');
            // $password = substr($random, 0, 10);
            // $newPassword = $password;
            $user = new User();
            $user->name = $all['name'];
            $user->image = !empty($all['image']) ? $all['image'] : null;
            $user->cover_pic = !empty($all['cover_pic']) ? $all['cover_pic'] : null;
            $user->wings = !empty($all['wings']) ? $all['wings'] : null;
            $user->icai_membership_no = !empty($all['icai_membership_no']) ? $all['icai_membership_no'] : null;
            $user->nominee_name = !empty($all['nominee_name']) ? $all['nominee_name'] : null;
            $user->qualification = !empty($all['qualification']) ? $all['qualification'] : null;
            $user->dob = $all['dob'] && !isset($all['dob']) && !empty($all['dob']) ? $all['dob'] : null;
            $user->blood_group = $all['blood_group']  ? $all['blood_group'] : null;
            $user->occupation = !empty($all['occupation']) ? $all['occupation'] : null;
            $user->member_occupation = !empty($all['member_occupation']) ? $all['member_occupation'] : null;
            $user->communication_address = $all['communication_address'] ? $all['communication_address'] : null;
            $user->office_address = !empty($all['office_address']) ? $all['office_address'] : null;
            $user->residence_address = !empty($all['residence_address']) ? $all['residence_address'] : null;
            $user->office_mobile = $all['office_mobile'] ? $all['office_mobile'] : null;
            $user->mobile_number = $all['mobile_number'];
            // $user->destination = $all['destination'];
            $user->spouse_name = !empty($all['spouse_name']) ? $all['spouse_name'] : null;
            $user->spouse_dob = $all['spouse_dob'] && !isset($all['spouse_dob']) && !empty($all['spouse_dob']) ? $all['spouse_dob'] : null;
            $user->marriage_date = $all['marriage_date'] && !isset($all['marriage_date']) && !empty($all['marriage_date']) ? $all['marriage_date'] : null;
            $user->nos_children = $all['nos_children'] ? $all['nos_children'] : null;
            $user->children_name_1 = !empty($all['children_name_1']) ? $all['children_name_1'] : null;
            $user->children_name_2 = !empty($all['children_name_2']) ? $all['children_name_2'] : null;
            $user->children_name_3 = !empty($all['children_name_3']) ? $all['children_name_3'] : null;
            $user->associate_org_member = !empty($all['associate_org_member']) ? $all['associate_org_member'] : null;
            $user->associate_org_position = !empty($all['associate_org_position']) ? $all['associate_org_position'] : null;
            $user->become = $all['become'] ? $all['become'] : null;
            $user->payment_type = $all['payment_type'] ? $all['payment_type'] : null;
            $user->role_id = !empty($all['role_id']) ? $all['role_id'] : null;
            $user->email = !empty($all['email']) ? $all['email'] : null;
            $user->discription = !empty($all['discription']) ? $all['discription'] : null;
            $user->option_1 = !empty($all['option_1']) ? $all['option_1'] : null;
            $user->password = Hash::make('Vcat@1234');
            // $user->password = Hash::make($newPassword);
            $user->status = !empty($all['status']) ? $all['status'] : true;
            $user->created_by = $all['user_id'];
            $user->approved = true;
            if (!empty($all['invite_id'])) {
                $user->approved = false;
            }
            $result = $user->save();
            $invite_details = null;
            if (!empty($all['invite_id'])) {
                $invite_details = Invitation::find($all['invite_id']);
                if ($invite_details) {
                    $invite_details_result = $invite_details->delete();
                }
            }
            //for client
            Mail::send('user_login', $all, function ($message) use ($all) {
                $message->to($all['email'])->subject('Membership Credentials');
                $message->from('info@vcat.co.in', 'Vcat');
            });

            return Response([
                'status' => 'success',
                'statuscode' => 200,
                'result' => 'data insertion done'
            ]);
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
    public function show($id)
    {
        try {
            //for board of trustees, mentors, past presidents

            $users = User::where('destination', $id)->get();
            // $users = User::where('destination', $id)->orderBy('name', 'ASC')->get();
            // $pastPresidents = User::where('destination', $id)->orderBy('id', 'ASC')->get();
            $result = [];
            $result['users'] = $users;
            // $result['pastPresidents'] = $pastPresidents;
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    //for geting single user data based on id
    public function showById($id)
    {
        try {
            $users = User::find($id);
            $result = [];
            $result['users'] = $users;
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
                'name' => 'required|string|max:255',
                // 'icai_membership_no' => 'required|string|max:255',
                // 'nominee_name' => 'required|string|max:255',
                // 'qualification' => 'required|string|max:255',
                // 'dob' => 'required|date',
                // 'blood_group' => 'required|string|max:255',
                // 'occupation' => 'required|string|max:255',
                // 'communication_address' => 'required',
                // 'office_address' => 'required|string',
                // 'residence_address' => 'required',
                // 'office_mobile' => 'required|numeric|min:10',
                // 'mobile_number' => 'required|numeric|min:10',
                // 'spouse_name' => 'required|string',
                // 'spouse_dob' => 'required|date',
                // 'marriage_date' => 'required|date',
                // 'nos_children' => 'required|integer',
                // 'children_name_1' => 'required|string',
                // 'children_name_2' => 'required|string',
                // 'children_name_3' => 'required|string',
                // 'associate_org_member' => 'required|string',
                // 'associate_org_position' => 'required|string',
                // 'become' => 'required|string',
                // 'payment_type' => 'required|string',
                // //////
                // 'role_id' => 'required|string',
                // 'email' => 'required|email',
                // 'discription' => 'string',
                // 'option_1' => 'string',
                // // 'password' => ['required', 'string', Password::min(8)->mixedCase()->symbols()],
                // // 'status' => 'required|bool',
                // // 'image' => 'required',
                // 'wings' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $userEmailCheck = User::where([['id', "!=", $id], ['deleted_at', null], ['email', $all['email']]])
                    ->get();
                $userMobileCheck = User::where([['id', "!=", $id], ['deleted_at', null], ['mobile_number', $all['mobile_number']]])
                    ->get();
                $errorMsg = 'Something went Wrong..';
                $allowUpdate = true;
                if (count($userEmailCheck) > 0 || count($userMobileCheck) > 0) {
                    $allowUpdate = false;
                }
                if ($allowUpdate) {
                    $user = User::find($id);
                    $user->name = $all['name'];
                    if (!empty($all['image'])) {
                        $user->image = $all['image'];
                    }
                    if (!empty($all['cover_pic'])) {
                        $user->cover_pic = $all['cover_pic'];
                    }
                    // $user->password = Hash::make($all['password']);
                    $user->email = $all['email'];
                    $user->wings = json_encode($all['wings']);
                    $user->icai_membership_no = $all['icai_membership_no'];
                    $user->nominee_name = $all['nominee_name'];
                    $user->qualification = $all['qualification'];
                    $user->dob = !empty($all['dob']) ? $all['dob'] : null;
                    $user->blood_group = $all['blood_group'];
                    $user->occupation = $all['occupation'];
                    $user->member_occupation = $all['member_occupation'];
                    $user->communication_address = $all['communication_address'];
                    $user->office_address = $all['office_address'];
                    $user->residence_address = $all['residence_address'];
                    $user->office_mobile = $all['office_mobile'];
                    $user->mobile_number = $all['mobile_number'];
                    // $user->destination = $all['destination'] ? $all['destination'] : null;
                    $user->spouse_name = $all['spouse_name'];
                    $user->spouse_dob = !empty($all['spouse_dob']) ? $all['spouse_dob'] : null;
                    $user->marriage_date = !empty($all['marriage_date']) ? $all['marriage_date'] : null;
                    $user->nos_children = $all['nos_children'];
                    $user->children_name_1 = $all['children_name_1'];
                    $user->children_name_2 = $all['children_name_2'];
                    $user->children_name_3 = $all['children_name_3'];
                    $user->associate_org_member = $all['associate_org_member'];
                    $user->associate_org_position = $all['associate_org_position'];
                    $user->become = $all['become'];
                    $user->payment_type = $all['payment_type'];
                    $user->role_id = $all['role_id'];
                    $user->email = $all['email'];
                    $user->discription = $all['discription'];
                    $user->option_1 = $all['option_1'];
                    $user->status = $all['status'] != false;
                    $user->modified_by = $all['user_id'];
                    $user->designation_title = $all['designation_title'] ? $all['designation_title'] : null;
                    $user->designation = $all['designation'] ? $all['designation'] : null;
                    $user->payment_transaction_id = !empty($all['payment_transaction_id']) ? $all['payment_transaction_id'] : null;
                    $user->inactive_status_comments = !empty($all['inactive_status_comments']) ? $all['inactive_status_comments'] : null;

                    $result = $user->save();

                    return Response(['status' => 'success', 'statuscode' => 200, 'result' => $user]);
                } else {
                    if (count($userEmailCheck) > 0 && count($userMobileCheck) > 0) {
                        $errorMsg = "Email and Mobile Number are already in use";
                    } else if (count($userEmailCheck) > 0) {
                        $errorMsg = "Email is already in use";
                    } else if (count($userMobileCheck) > 0) {
                        $errorMsg = "Mobile Number is already in use";
                    }
                    return response()->json(['status' => '0', 'statusCode' => 409, 'error' => $errorMsg], 409);
                }
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function profileUpdate(Request $request, $id)
    {
        try {
            $all = json_decode($request->getContent(), true);

            $rules = array(
                'name' => 'required|string|max:255',
                // 'image' => 'required',
                // 'cover_pic' => 'required',
                'mobile_number' => 'required|numeric|min:10',
            );
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                return response()->json(['status' => '0', 'statuscode' => 400, "message" => "Validation error", 'error' => $validator->errors()->toArray()], 400);
            } else {
                $user = User::find($id);
                $user->name = $all['name'];
                $user->image = $all['image'];
                $user->cover_pic = $all['cover_pic'];
                $user->mobile_number = $all['mobile_number'];
                $user->dob = $all['dob'];
                $user->modified_by = $all['user_id'];
                $result = $user->save();
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $user]);
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
            $user = User::find($id);
            $user->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted success']);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function invite(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);

            $rules = array(
                'name' => 'required|max:255',
                'email' => 'required',
                'phone' => 'required|numeric|min:10',
            );
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
            } else {
                $email_check = User::where('email', '=', $all['email'])->get();
                $phone_check = User::where('mobile_number', '=', $all['phone'])->get();
                $valid = true;
                if (count($email_check) != 0) {
                    $valid = false;
                }
                if (count($phone_check) != 0) {
                    $valid = false;
                }
                if ($valid) {
                    $invitations = new Invitation();
                    $invitations->name = $all['name'];
                    $invitations->email = $all['email'];
                    $invitations->phone = $all['phone'];
                    $invitations->created_by = $all['user_id'];
                    $invitations->secret_key = Str::orderedUuid();
                    $result = $invitations->save();

                    //for client
                    // Mail::send('invite', $invitations, function ($message) use ($invitations) {
                    //     $message->to($invitations['email'])->subject('Vcat invitation');
                    //     $message->from('info@vcat.co.in', 'Vcat');
                    // });
                    $html_body = "<h1>Welcome to VCAT</h1>
                    <p>Your subscription is confirmed!</p>
                    <p>Thank you for joining the community with over 600+ talented CA like you.</p>
                    <p>There is so much we can do!</p>
                    <p>Use the link below to fill in the required details.</p>
                    <h2>https://admin.vcat.co.in/register/$invitations->secret_key</h2>
                    <p>Note: The contact number and email id section are not editable.</p>
                    ";
                    $headers = "MIME-Version: 1.0" . "\r\n";
                    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                    $headers .= 'From:VCAT<info@vcat.co.in>' . "\r\n";
                    $subject = "VCAT Invitation";
                    $mail_result = mail($invitations->email, $subject, $html_body, $headers);

                    return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result, 'mail_result' => $mail_result]);
                } else {
                    $error_message = "";
                    if (count($email_check) != 0) {
                        $error_message = "Email";
                    }
                    if (count($phone_check) != 0) {
                        if ($error_message == "") {
                            $error_message = "Phone Number";
                        } else {
                            $error_message = $error_message . " and Phone Number";
                        }
                    }
                    $error_message = $error_message . " already exists";

                    return response()->json(["status" => "error", 'statuscode' => 400, "message" => $error_message, 'email' => $email_check, 'phone' => $phone_check], 400);
                }
            }
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    // public function search(Request $request)
    // {
    //     try {
    //         $all = json_decode($request->getContent(), true);
    //         $search = $all['search'];
    //         $allAttachments = User::all();
    //         $tagKeyword = User::where('name', 'LIKE', "%{$search}%")
    //             ->orWhere('icai_membership_no', 'LIKE', "%{$search}%")
    //             ->orWhere('company_name', 'LIKE', "%{$search}%")
    //             ->orWhere('mobile_number', 'LIKE', "%{$search}%")
    //             ->orWhere('created_at', 'LIKE', "%{$search}%")
    //             ->get();
    //         $result = [];
    //         $result['Keyword_search'] = $tagKeyword;

    //         return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
    //     } catch (\Exception$e) {
    //         return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
    //     }
    // }
    public function dropDown(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            //selected wing id based on, getting memebrs except selected wing members

            $roles = Role::select('id')->get();
            if ($all['designation_id'] == 1) {
                $users = Role::where('designation', 1)->select('name', 'id')->get();
            }
            if ($all['designation_id'] == 2) {
                $users = Role::where('designation', 2)->select('name', 'id')->get();
            }
            if ($all['designation_id'] == 3) {
                $users = Role::where('designation', 3)->select('name', 'id')->get();
            }

            $result = [];
            $result['roles_dropdown'] = $users;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function saveToken(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            if (!empty($all['user_id'])) {
                User::where('id', $all['user_id'])->update(['fcm_token' => $all['fcm_token']]);
            }
            return Response([
                'status' => 'success',
                'statuscode' => 200,
                'result' => 'fcm token saved successfuly',

            ]);
        } catch (\Exception $e) {
            return Response([
                'status' => 'error',
                'statuscode' => 500,
                'result' => "error " . $e->getMessage(),
            ], 500);
        }
    }
    public function removePics(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            if (!empty($all['cover_pic'])) {
                User::where('id', $all['user_id'])->update(['cover_pic' => '']);
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'Successfully removed cover pic'], 200);
            }
            if (!empty($all['profile_pic'])) {
                User::where('id', $all['user_id'])->update(['image' => '']);
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'Successfully removed profile pic'], 200);
            }
            return Response(['status' => 'errror', 'statuscode' => 400, 'result' => 'please select profile or cover pic, dev:please pass variables in request body'], 400);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    // public function Filter(Request $request)
    // {
    //     //$all = json_decode($request->getContent(), true);

    //     try
    //     {
    //         $all = json_decode($request->getContent(), true);
    //         switch ($all['filter']) {
    //             case "one_week":
    //                 $filterData = Carbon::today()->subDays(6);
    //                 break;
    //             case "15days":
    //                 $filterData = Carbon::today()->subDays(15);
    //                 break;
    //             case "30days":
    //                 $filterData = Carbon::today()->subDays(30);
    //                 break;
    //             case "6months":
    //                 $filterData = Carbon::now()->subMonths(6);
    //                 break;
    //             case "one_year":
    //                 $filterData = Carbon::now()->subMonths(12);
    //                 break;
    //             case "morethan_one_year":
    //                 $moreOne = User::orderBy('id', 'DESC')->get();
    //                 break;
    //         }
    //         if ($all['filter'] == 'morethan_one_year') {
    //             $result['filter_data'] = $moreOne;
    //         } else {
    //             $filter = User::where('created_at', '>=', $filterData)->orderBy('id', 'DESC')->get();
    //             $result['filter_data'] = $filter;
    //         }

    //         return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
    //     } catch (\Exception$e) {
    //         return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()], 500);
    //     }
    // }
    public function tableData(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $result = User::orderBy('id', 'DESC')
                ->when(!empty($all['filter']), function ($query) use ($all) {
                    return $query->where('created_at', '<=', $all['filter']);
                })
                ->select('id', 'name', 'role_id', 'occupation', 'email', 'mobile_number', 'created_by', 'approved', 'designation')
                ->get();
            $roles = Role::select('id', 'name')->get()->toArray();
            foreach ($result as $user) {
                $current_user_roles = "";
                if (!empty($user['role_id']) && strpos($user['role_id'], "[") !== false && strpos($user['role_id'], "]") !== false) {
                    $role_ids = json_decode($user['role_id'], true);
                    foreach ($role_ids as $current_role_id) {
                        for ($i = 0; $i < count($roles); $i++) {
                            $current_role = $roles[$i];
                            if ($current_role['id'] == $current_role_id) {
                                if ($current_user_roles == "") {
                                    $current_user_roles = $current_role['name'];
                                } else {
                                    $current_user_roles = $current_user_roles . ", " . $current_role['name'];
                                }
                                break;
                            }
                        }
                    }
                } else {
                    for ($i = 0; $i < count($roles); $i++) {
                        $current_role = $roles[$i];
                        if ($current_role['id'] == $user['role_id']) {
                            $current_user_roles = $current_role['name'];
                            break;
                        }
                    }
                }
                $user['roles'] = $current_user_roles;
            }
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function usersDropdown()
    {
        try {
            $result = User::orderBy('id', 'DESC')->select('id as value', 'name as label')->where('deleted_at', null)->get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function  getInviteDetails($id)
    {
        try {
            $result = Invitation::where("secret_key", "=", $id)->first();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
    public function userWingDetails($user_id)
    {
        try {
            $wing_list = Wing::orderBy('id', 'DESC')
                ->select('id')->get();
            $user_wing_list = array();
            foreach ($wing_list as $wing) {
                $wing_members = array();
                $wing_members_list_result = WingMember::where('wing_id', '=', $wing->id)
                    ->select('members')->get();
                foreach ($wing_members_list_result as $wing_members_result) {
                    $members = json_decode($wing_members_result->members, true);
                    foreach ($members as $member) {
                        array_push($wing_members, $member);
                    }
                }
                $wing->members = array_unique($wing_members);
                if (in_array($user_id, $wing->members)) {
                    array_push($user_wing_list, $wing->id);
                }
            }
            return $user_wing_list;
        } catch (\Exception $e) {
            return [];
        }
    }
    public function userEventDetails($user_id, $user_wing_ids)
    {
        try {
            $events = Event::select('id', 'name as title', 'hosted_by', 'from_date', 'to_date', 'wings', 'members')
                ->whereNotNull('from_date')
                ->get();
            $user_events = array();
            $dates = array();
            foreach ($events as $event) {
                $user_ids = array();
                // $hosts_ids = json_decode($event['hosted_by'], true);
                // if (is_array($hosts_ids)) {
                //     foreach ($hosts_ids as $host_id) {
                //         if (is_numeric($host_id)) {
                //             if (!in_array($host_id, $user_ids)) {
                //                 array_push($user_ids, $host_id);
                //             }
                //         }
                //     }
                // }
                if (!in_array($user_id, $user_ids)) {
                    $member_ids = json_decode($event['members'], true);
                    if (is_array($member_ids)) {
                        foreach ($member_ids as $member_id) {
                            if (is_numeric($member_id)) {
                                if (!in_array($member_id, $user_ids)) {
                                    array_push($user_ids, $member_id);
                                }
                            }
                        }
                    }
                }
                if (!in_array($user_id, $user_ids)) {
                    $wing_ids = json_decode($event['wings'], true);
                    if (is_array($wing_ids)) {
                        foreach ($wing_ids as $wing_id) {
                            if (is_numeric($wing_id) && in_array($wing_id, $user_wing_ids)) {
                                array_push($user_ids, $user_id);
                            }
                        }
                    }
                }
                if (in_array($user_id, $user_ids)) {
                    array_push($user_events, $event);
                    array_push($dates, $event->from_date);
                }
            }
            return ['details' => $user_events, 'dates' => $dates];
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
    public function userMeetingDetails($user_id, $user_wing_ids)
    {
        try {
            $meetings = Meeting::select('id', 'title', 'hosted_by', 'from_date', 'to_date', 'wings', 'members')
                ->whereNotNull('from_date')
                ->get();
            $user_meetings = array();
            $dates = array();
            foreach ($meetings as $meeting) {
                $user_ids = array();
                $hosts_ids = json_decode($meeting['hosted_by'], true);
                if (is_array($hosts_ids)) {
                    foreach ($hosts_ids as $host_id) {
                        if (is_numeric($host_id)) {
                            if (!in_array($host_id, $user_ids)) {
                                array_push($user_ids, $host_id);
                            }
                        }
                    }
                }

                if (!in_array($user_id, $user_ids)) {
                    $member_ids = json_decode($meeting['members'], true);
                    if (is_array($member_ids)) {
                        foreach ($member_ids as $member_id) {
                            if (is_numeric($member_id)) {
                                if (!in_array($member_id, $user_ids)) {
                                    array_push($user_ids, $member_id);
                                }
                            }
                        }
                    }
                }
                if (!in_array($user_id, $user_ids)) {
                    $wing_ids = json_decode($meeting['wings'], true);
                    if (is_array($wing_ids)) {
                        foreach ($wing_ids as $wing_id) {
                            if (is_numeric($wing_id) && in_array($wing_id, $user_wing_ids)) {
                                array_push($user_ids, $user_id);
                            }
                        }
                    }
                }
                if (in_array($user_id, $user_ids)) {
                    array_push($user_meetings, $meeting);
                    array_push($dates, $meeting->from_date);
                }
            }
            return ['details' => $user_meetings, 'dates' => $dates];
        } catch (\Exception $e) {
            return [];
        }
    }
    public function getCalendarDates($id)
    {
        try {
            $user_wing_ids = $this->userWingDetails($id);
            $user_involved_events = $this->userEventDetails($id, $user_wing_ids);
            $user_involved_meetings = $this->userMeetingDetails($id, $user_wing_ids);

            return Response([
                'status' => 'success',
                'statuscode' => 200,
                'result' => [
                    'events' => $user_involved_events,
                    'meetings' => $user_involved_meetings
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    public function approveUser(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $id = $all['id'];
            $user_id = $all['user_id'];
            $user = User::find($id);
            $user->approved = true;
            $user->modified_by = $user_id;
            $result = $user->save();
            return Response([
                'status' => 'success',
                'statuscode' => 200,
                'result' => "Member updated successfully",
                'saveResult' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
