<?php

namespace App\Services;

class FCMService
{
    public static function send($token, $notification, $data)
    {
        $serverKey = 'AAAAnqltzVA:APA91bErA3_cOFr05qe3hiAtUCp__fogaCciNhgpfUzkrdBUNONLGOJldF5uiKBnYFVbGpXKL4K0Xe5psRP4YCS1rA58P2q9r2xxwwg8VfD4cQ_bZcbrXlWgYM7qc_HWiGIfxf_ry54A';
        $fields = [
            "to" => $token,
            "priority" => 10,
            'notification' => $notification,
            'data' => $data,
            'vibrate' => 1,
            'sound' => 1,
        ];
// dd($token)
        $headers = [
            'accept: application/json',
            'Content-Type: application/json',
            'Authorization: key=' . $serverKey,
        ];
        // dd($headers);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        $result = curl_exec($ch);
        curl_close($ch);

    }
}