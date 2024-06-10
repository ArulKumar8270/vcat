<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BannerController extends Controller
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
            $result = Banner::get();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
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
                'page' => 'required|string',
                'title' => 'required|string',
                'content' => 'required|string',
                // 'option_1' => 'required',
                // 'image' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $banners = new Banner();
                $banners->page = $all['page'];
                $banners->title = $all['title'];
                $banners->content = $all['content'];
                $banners->image = $all['image'];
                $banners->option_1 = $all['option_1'];
                $banners->created_by = $all['user_id']; // pass user id

                $result = $banners->save();

                return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'insertion done..']);
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
            $banners = Banner::find($id);
            $result = [];
            $result['banners'] = $banners;

            return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
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
                'page' => 'required|string',
                'title' => 'required|string',
                'content' => 'required|string',
                // 'option_1' => 'required',
                // 'image' => 'required',
            );
            $Validator = Validator::make($all, $rules);
            if (!$Validator->passes()) {
                return response()->json(['status' => '0', 'error' => $Validator->errors()->toArray()]);
            } else {
                $banners = Banner::find($id);
                $banners->page = $all['page'];
                $banners->title = $all['title'];
                $banners->content = $all['content'];
                $banners->image = $all['image'];
                $banners->option_1 = $all['option_1'];
                $banners->modified_by = $all['user_id']; // pass user id

                $banners->save();
                $result = [];
                $result['banners'] = $banners;

                // return $product;
                return Response(['status' => 'success', 'statuscode' => 200, 'result' => $result]);
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
            $banners = Banner::find($id);
            $banners->delete();
            return Response(['status' => 'success', 'statuscode' => 200, 'result' => 'data has been deleted sucess']);
        } catch (\Exception$e) {
            return response()->json(['statusCode' => 500, 'error' => 'Something went Wrong..' . $e->getMessage()], 500);
        }
    }
}
