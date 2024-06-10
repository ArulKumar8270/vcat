<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try
        {
            $contacts = Contact::all();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $contacts]);
        } catch (\Exception$e) {
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
                'name' => 'required|max:255',
                'email' => 'required',
                'phone' => 'required|numeric|min:10',
                // 'messages' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $contacts = new Contact();
                $contacts->name = $all['name'];
                $contacts->email = $all['email'];
                $contacts->phone = $all['phone'];
                $contacts->message = $all['messages'];
                $result = $contacts->save();

                //for client
                Mail::send('mail', $all, function ($message) use ($all) {
                    $message->to($all['email'])->subject('Thank you for Contacting Us');
                    $message->from('info@vcat.co.in', 'Vcat');
                });
                // for admin
                Mail::send('mail_admin', $all, function ($message) use ($all) {
                    $message->to('monica@kpdigiteers.com')->subject('Vcat contact form submit.');
                    $message->from('info@vcat.co.in', 'Vcat');
                });

                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $contacts]);
            }
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try
        {
            $contacts = Contact::find($id);
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $contacts]);
        } catch (\Exception$e) {
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
                'name' => 'required|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|numeric|min:10',
                'message' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $contacts = Contact::find($id);
                $contacts->name = $all['name'];
                $contacts->email = $all['email'];
                $contacts->phone = $all['phone'];
                $contacts->message = $all['message'];
                $result = $contacts->save();

                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'updated done..']);
            }
        } catch (\Exception$e) {
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
        try
        {
            $contacts = Contact::find($id);
            $contacts->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
