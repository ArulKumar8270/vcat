<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FCMService;
use Illuminate\Http\Request;
use Kreait\Firebase\Factory;

class FirebaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $factory = (new Factory)->withServiceAccount(__DIR__ . '/FirebaseKey.json')
            ->withDatabaseUri('https://vcat-api-default-rtdb.firebaseio.com/');
        $database = $factory->createDatabase();

        $newPost = $database
            ->getReference('/blog/posts')
            ->push([
                'title' => 'Laravel FireBase Tutorial',
                'category' => 'Laravel',
            ]);
        echo '<pre>';
        print_r($newPost->getvalue());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function sendNotification(Request $request)
    {
        // get a user to get the fcm_token that already sent.               from mobile apps
        $user = User::findOrFail(77);
        FCMService::send(
            $user->fcm_token,
            [
                'title' => 'hi howru hiuhdkxhkj',
                'body' => 'your post is liked nag',
            ],
            [
                'message' => 'Extra Notification Data',
            ],
        );

    }
}