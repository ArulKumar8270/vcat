<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CarrierAttachController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function index(Request $request)
    // {
    //     try
    //     {
    //         $result = Carrier_attachment::paginate(5);
    //         return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
    //     } catch (\Exception$e) {
    //         return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()]);
    //     }
    // }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // public function store(Request $request)
    // {
    //     try {
    //         $rules = array(
    //             'carrier_docspath' => 'required|mimes:csv,txt,xlx,xls,pdf|max:2048',
    //             'tags' => 'required|string',
    //         );
    //         $Validator = Validator::make($request->all(), $rules);
    //         if ($Validator->fails()) {
    //             return response()->json(["status" => "failed", "message" => "Validation error", "errors" => $Validator->errors()], 400);
    //         } else {
    //             $extension = $request->file('carrier_docspath')->extension();
    //             $docName = time() . '.' . $extension;
    //             $destinationPath = 'public/storage/carrier_attachments'; // for server
    //             // $destinationPath = 'storage/carrier_attachments'; //for localhost
    //             $path = $request->file('carrier_docspath')->move($destinationPath, $docName);
    //             $carrierAttach = 'https://vcat.co.in/staging/vcat-api/public/storage/carrier_attachments/' . $docName;
    //             $Carrier_attachments = Carrier_attachment::create([
    //                 'carrier_docspath' => $carrierAttach,
    //                 'tags' => $request['tags'],
    //                 'file_name' => $docName,
    //             ]);
    //             $result = [];
    //             $result['carrierAttach'] = $carrierAttach;
    //             return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result], 200);
    //         }
    //     } catch (\Exception$e) {
    //         return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()]);
    //     }
    // }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function search($id)
    // {
    //     try {
    //         //$all = json_decode($id->getContent(), true);

    //         $allAttachments = Carrier_attachment::all();
    //         $tagKeyword = Carrier_attachment::where('file_name', 'LIKE', "%{$id}%")
    //             ->orWhere('tags', 'LIKE', "%{$id}%")
    //             ->get();
    //         $result = [];
    //         // $result['all_files'] = $allAttachments;
    //         $result['Keyword_search'] = $tagKeyword;

    //         return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
    //     } catch (\Exception$e) {
    //         return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()]);
    //     }
    // }
    // public function show($id)
    // {
    //     {
    //         try {
    //             //$all = json_decode($id->getContent(), true);
    //             $recentUploads = Carrier_attachment::where('is_archive', 0)->orderBy('id', 'DESC')->get();
    //             $archiveUloads = Carrier_attachment::where('is_archive', 1)->orderBy('id', 'DESC')->get();

    //             $result = [];
    //             $result['recentUploads'] = $recentUploads;
    //             $result['archiveUloads'] = $archiveUloads;

    //             return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
    //         } catch (\Exception$e) {
    //             return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong.. ' . $e->getMessage()]);
    //         }
    //     }
    // }

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
}
