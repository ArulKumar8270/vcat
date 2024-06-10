<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\RolePermission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Log;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'requestOtp', 'verifyOtp', 'resetPassword', 'reSendOtp']]);
    }
    /**
     * Get a JWT via given credentials.
     *
     * @param  Request  $request
     * @return Response
     */
    public function login(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            if (is_numeric($all['username'])) {
                $rules = array(
                    'username' => 'required|numeric',
                    // 'password' => ['required', 'string', Password::min(8)->mixedCase()->symbols()->numbers()],
                );
            } else {
                $rules = array(
                    'username' => 'required|string|email',
                    //  'password' => ['required', 'string', Password::min(8)->mixedCase()->symbols()->numbers()],
                );
            }

            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                // return Response([
                //     'status' => 'error', 'statuscode' => 400, 'result' => $Validator->errors(),
                // ], 400);
                return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
            } else {
                $user = User::where('mobile_number', $all['username'])->orWhere('email', $all['username'])->first();
                $credentials = [
                    "password" => $all['password'],
                ];
                if ($user == false) {
                    return Response([
                        'status' => 'error', 'statuscode' => 500, 'result' => 'your email id or phone number is wrong..please check',
                    ], 500);
                } else {

                    if (Hash::check($all['password'], $user->password) == false) {
                        return Response([
                            'status' => 'error', 'statuscode' => 500, 'result' => 'your password is wrong',
                        ], 500);
                    } else {
                        if (is_numeric($all['username'])) {
                            $credentials["mobile_number"] = $user->mobile_number;
                        } else {
                            $credentials["email"] = $user->email;
                        }
                    }

                    if (!$token = Auth::attempt($credentials)) {
                        return response()->json(['message' => 'Unauthorized'], 401);
                    }
                    $user_id = $user->id;
                    $allowedPermissions = RolePermission::where('role_id', $user->role_id)->where('is_deleted', 0)->pluck('permission_id')->toArray();

                    return $this->respondWithToken($token, $user_id, $allowedPermissions);
                }
            }
            return Response([
                'status' => 'error', 'statuscode' => 500, 'result' => 'username or password is empty',
            ], 500);
        } catch (Exception $e) {
            return Response([
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'error ' . $e->getMessage(),
            ], 500);
        }
    }

    public function requestOtp(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $response = [
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'error in mail id',
            ];
            if (is_numeric($all['username'])) {
                $rules = array(
                    'username' => 'required|numeric',
                );
            } else {
                $rules = array(
                    'username' => 'required|string|email',
                );
            }
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                // return $Validator->errors();
                return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" => $Validator->errors()], 400);
            } else {
                $username = $all['username'];
                $otp = rand(1000, 9999);
                Log::info("otp = " . $otp);
                $userData = User::where('mobile_number', $username)->orWhere('email', $username)->first();
                if ($userData == false) {
                    return Response([
                        'status' => 'error', 'statuscode' => 500, 'result' => 'your email id or phone number is wrong..please check',
                    ], 500);
                } else {
                    User::find($userData['id'])->update(['otp' => $otp]);
                    $mailID = $userData->email;
                    $mail_details = [
                        'subject' => "Verification required",
                        'body' => $otp . " is the onetime password (OTP) to validate. Do not share this. If not requested, Contact VCAT Admin.",
                    ];
                    //mail send
                    Mail::send('otp_mail', $mail_details, function ($message) use ($mailID) {
                        $message->to($mailID)->subject('Verify OTP');
                        $message->from('info@vcat.co.in', 'Vcat');
                    });

                    //sms
                    $ID = "vcat@kpdigiteers.com";
                    $Pwd = "Vcat@SMS2022!@";
                    $TemplateId = "1007901683770781245";
                    $baseurl = "https://www.businesssms.co.in";
                    $PhNo = "+91" . $userData->mobile_number;
                    $Text = urlencode($otp . " is the onetime password (OTP) to validate. Do not share this. If not requested, Contact VCAT Admin.");
                    $url = "$baseurl/sms.aspx?Id=$ID&Pwd=$Pwd&PhNo=$PhNo&text=$Text&TemplateID=$TemplateId";
                    $ret = file($url);
                    // print_r($ret);
                    $result = [];
                    $result['user_id'] = $userData->id;
                    return Response([
                        'status' => 'success',
                        'statuscode' => 200,
                        'result' => $result,
                    ], 200);
                }
            }
            return Response($response);
        } catch (Exception $e) {
            return Response([
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'error ' . $e->getMessage(),
            ], 500);
        }
    }

    public function verifyOtp(Request $request)
    {

        try {
            $all = json_decode($request->getContent(), true);
            $response = [
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'invalid otp',
            ];
            $rules = array(
                'otp' => 'required|numeric',
            );
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                return response()->json(["status" => "error", 'statuscode' => 400, "result" => 'invalid otp'], 400);
            } else {
                $otp = $all['otp'];
                $user_id = $all['user_id'];
                $user = User::find($user_id)->where('otp',"=", $otp)->get();
                if ($user) {
                    User::where('id', $user_id)->update(['otp' => null]);
                    return Response([
                        'status' => 'success',
                        'statuscode' => 200,
                        'result' => 'otp verified please create new password',
                    ], 200);
                }
            }
            return Response($response, 500);
        } catch (Exception $e) {
            return Response([
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'error ' . $e->getMessage(),
            ], 500);
        }
    }

    public function resetPassword(Request $request, $user_id)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $response = [
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'Something wrong..',
            ];
            $rules = array(
                'password' => ['required', 'string', Password::min(8)->mixedCase()->symbols()->numbers()],
                'repeatpassword' => 'required_with:password|same:password',

            );
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" =>
                $Validator->errors()], 400);
            } else {
                // $user_id = $all['user_id'];
                $result = User::where('id', $user_id)->update(['password' => Hash::make($all['password'])]);
                $userData = User::where('id', $user_id)->first();
                $result = [];
                $result['user_id'] = $userData->id;
                $response = [
                    'status' => 'success',
                    'statuscode' => 200,
                    'result' => $result,
                ];
            }
            return Response($response);
        } catch (Exception $e) {
            return Response([
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'error ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $user_id)
    {
        try {
            // $all = json_decode($request->all(), true);
            $all = json_decode($request->getContent(), true);

            $response = [
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'Something wrong..',
            ];
            $rules = array(
                'oldpassword' => 'required',
                'newpassword' => ['required', 'string', Password::min(8)->mixedCase()->symbols()->numbers()],
                'repeatpassword' => 'required',

            );
            $Validator = Validator::make($all, $rules);
            if ($Validator->fails()) {
                return response()->json(["status" => "error", 'statuscode' => 400, "message" => "Validation error", "result" =>
                $Validator->errors()], 400);
            }
            $oldpassword = $all['oldpassword'];
            $newpassword = $all['newpassword'];
            $repeatpassword = $all['repeatpassword'];
            //$user_id = $all['user_id'];

            $user = User::where('id', $user_id)->first();
            $check = Hash::check($all['oldpassword'], $user->password);

            if ($oldpassword == $newpassword) {
                return Response([
                    'status' => 'error', 'statuscode' => 401, 'result' => 'your old password and new password must be different',
                ], 401);
            } elseif ($newpassword != $repeatpassword) {
                return Response([
                    'status' => 'error', 'statuscode' => 401, 'result' => 'your confirm password is not matched with new password',
                ], 401);
            } else {

                if ($check == true) {
                    $result = User::where('id', $user_id)->update(['password' => Hash::make($all['newpassword'])]);
                    $response = [
                        'status' => 'success',
                        'statuscode' => 200,
                        'result' => "password changed sucessfully",
                    ];
                } else {
                    return Response([
                        'status' => 'error', 'statuscode' => 401, 'result' => 'your old password is incorrect',
                    ], 401);
                }
            }
            return Response($response);
        } catch (Exception $e) {
            return Response([
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'error ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateToken(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            if (!empty($all['user_id'])) {
                User::where('id', $all['user_id'])->update(['fcm_token' => $all['fcm_token']]);
            }
            return Response([
                'status' => 'success',
                'statuscode' => 200,
                'result' => 'updated fcm token successfuly',
            ]);
        } catch (\Exception $e) {
            return Response([
                'status' => 'error',
                'statuscode' => 500,
                'result' => "error " . $e->getMessage(),
            ], 500);
        }
    }

    public function reSendOtp(Request $request)
    {
        try {
            $all = json_decode($request->getContent(), true);
            $response = [
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'invalid user id',
            ];
            // $rules = array();
            // $Validator = Validator::make($all, $rules);
            // if ($Validator->fails()) {
            //     return Response([
            //         'status' => 'error', 'statuscode' => 400, 'result' => $Validator->errors(),
            //     ], 400);
            // } else {
            $user_id = $all['user_id'];
            $userData = User::where('id', $user_id)->select('email', 'mobile_number', 'id', 'otp')->first();
            // $otp = rand(1000, 9999);
            // Log::info("otp = " . $otp);
            $otp = $userData['otp'];
            // $user = User::where('mobile_number', $userData->mobile)->orWhere('email', $userData->email)->update(['otp' => $otp]);
            if ($userData == false) {
                return Response([
                    'status' => 'error', 'statuscode' => 500, 'result' => 'your email id or phone number is incorrect',
                ], 500);
            } else {
                $mailID = $userData->email;
                $mail_details = [
                    'subject' => "Verification required",
                    'body' => $otp . " is the onetime password (OTP) to validate. Do not share this. If not requested, Contact VCAT Admin.",
                ];
                //mail send
                Mail::send('otp_mail', $mail_details, function ($message) use ($mailID) {
                    $message->to($mailID)->subject('Verify OTP');
                    $message->from('info@vcat.co.in', 'Vcat');
                });
                // }
                //sms
                $ID = "vcat@kpdigiteers.com";
                $Pwd = "Vcat@SMS2022!@";
                $TemplateId = "1007901683770781245";
                $baseurl = "https://www.businesssms.co.in";
                $PhNo = "+91" . $userData->mobile_number;
                $Text = urlencode($otp . " is the onetime password (OTP) to validate. Do not share this. If not requested, Contact VCAT Admin.");
                $url = "$baseurl/sms.aspx?Id=$ID&Pwd=$Pwd&PhNo=$PhNo&text=$Text&TemplateID=$TemplateId";
                $ret = file($url);
                $result = [];
                $result['user_id'] = $userData->id;
                return Response([
                    'status' => 'success',
                    'statuscode' => 200,
                    'result' => 'OTP sent successfully please check your mail',
                ], 200);
            }
            return Response($response);
        } catch (Exception $e) {
            return Response([
                'status' => 'error',
                'statuscode' => 500,
                'result' => 'error ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user details.
     *
     * @param Request $request
     * @return Response
     */
    public function token()
    {
        return response()->json(auth()->user());
    }
}
