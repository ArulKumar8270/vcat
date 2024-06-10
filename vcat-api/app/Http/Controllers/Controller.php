<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    public function respondWithToken($token, $user_id, $allowedPermissions)
    {

        $token_type = 'bearer';
        $expires_in = auth()->factory()->getTTL() * 60;
        $result = [];
        $result['token'] = $token;
        $result['token_type'] = $token_type;
        $result['user_id'] = $user_id;
        $result['permissions'] = $allowedPermissions;
        $result['expires_in'] = $expires_in;
        return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);

    }

}
