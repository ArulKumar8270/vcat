<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegisterConfirmation;


class MailController extends Controller
{
    public function mail()
    {
        $data = array('name' => "vcat");
        Mail::send('mail', $data, function ($message) {
            $message->to('bush.nagendra@gmail.com', 'vcat')->subject('‘Test Mail from vct');
            $message->from('nagendra.nivas@gmail.com', 'vcat');
        });
        echo 'Email Sent. Check your inbox.';
    }
}
