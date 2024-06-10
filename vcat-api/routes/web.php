<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
 */

//   $router->get('/', function () use ($router) {
//      return $router->app->version();
//  });
$router->group(['middleware' => 'auth', 'prefix' => 'api/v1', 'namespace' => 'v1'], function ($router) {
    $router->get('token', 'AuthController@token');

});
$router->group(['prefix' => 'api/v1', 'namespace' => 'v1'], function () use ($router) {

    $router->get('firebase', 'FirebaseController@index');
    $router->post('notification/update', 'AuthController@updateToken');

    //for mail
    $router->get('send_email', 'MailController@mail');
    //for otp sms
    $router->get('sms_otp', 'NotificationController@sendSmsNotificaition');
    $router->post('notification/insert', 'NotificationController@store');
    $router->put('notification/update/{id}', 'NotificationController@update');
    $router->get('notification/{id}', 'NotificationController@show');
    $router->get('notifications', 'NotificationController@showAll');

    $router->post('notification/reminder/send', 'NotificationController@reminderNotification');
    $router->post('notification_list', 'NotificationController@notificationList');
    $router->delete('notification/delete/{id}', 'NotificationController@destroy');
    $router->put('notification/readed', 'NotificationController@readedNotification');
    $router->put('notification/clear_all', 'NotificationController@clearAll');
    $router->put('notification/read_all', 'NotificationController@readAll');
    $router->post('notification/share', 'NotificationController@shareNotification');

    //for forgot password and login
    $router->put('create_password/{user_id}', 'AuthController@resetPassword');
    $router->post('login', 'AuthController@login');
    $router->post('request_otp', 'AuthController@requestOtp');
    $router->post('resend_otp', 'AuthController@reSendOtp');
    $router->post('verify_otp', 'AuthController@verifyOtp');

    //passwordchange based on db old password
    $router->put('changepassword/{user_id}', 'AuthController@update');

    //for users
    $router->post('/users', 'UserController@index');
    $router->post('/all_users', 'UserController@allUsers');
    $router->post('/insert', 'UserController@store');
    $router->put('/update/{id}', 'UserController@update');
    $router->delete('/delete/{id}', 'UserController@destroy');
    $router->get('/users/{id}', 'UserController@show');
    $router->get('/single_user/{id}', 'UserController@showById');
    $router->post('/send_invite', 'UserController@invite');
    $router->post('users/search/data', 'UserController@search');
    $router->post('users/dropdown/filter', 'UserController@filter');
    $router->put('profile/update/{id}', 'UserController@profileUpdate');
    $router->post('users/dropdown/roles', 'UserController@dropDown');
    $router->put('/save_token', 'UserController@saveToken');
    $router->put('profile_images/update', 'UserController@removePics');
    $router->post('/users/get', 'UserController@tableData');
    $router->get('dropdown/users', 'UserController@usersDropdown');
    $router->get('invite/get/{id}', 'UserController@getInviteDetails');
    $router->get('calendar/get/{id}', 'UserController@getCalendarDates');
    $router->put('user/approve', 'UserController@approveUser');

    //for pages
    $router->post('/pages', 'PageController@index');
    $router->post('/pages/insert', 'PageController@store');
    $router->put('pages/update/{id}', 'PageController@update');
    $router->delete('pages/delete/{id}', 'PageController@destroy');
    $router->get('pages/{id}', 'PageController@show');
    $router->post('content/dropdown/list', 'PageController@contentManagmentDrop');
    //for wings
    $router->post('/wings', 'WingController@index');
    $router->post('/wings/insert', 'WingController@store');
    $router->put('wings/update/{id}', 'WingController@update');
    $router->delete('wings/delete/{id}', 'WingController@destroy');
    $router->get('wings/{id}', 'WingController@show');
    $router->get('/single_wing/{id}', 'WingController@showByid');
    $router->post('/wings/get', 'WingController@tableData');
    $router->get('dropdown/wings', 'WingController@getWingMembers');

    //for wings members
    $router->get('wing/members/dropdown', 'WingController@wingMemberDrop');
    $router->post('wing/members/insert', 'WingController@wingMemberStore');
    $router->put('wing/members/update/{id}', 'WingController@wingMemberUpdate');
    $router->delete('wing/members/delete/{id}', 'WingController@wingMembersDestroy');
    $router->get('wing/members/all', 'WingController@wingMembersAll');
    $router->get('wing/members/show/{id}', 'WingController@wingMemberShowByid');

    //for contacts
    $router->get('/contacts', 'ContactController@index');
    $router->post('/contacts/insert', 'ContactController@store');
    $router->put('contacts/update/{id}', 'ContactController@update');
    $router->delete('contacts/delete/{id}', 'ContactController@destroy');
    $router->get('contacts/{id}', 'ContactController@show');
    //for event
    $router->get('/events', 'EventController@index');
    $router->post('/events/insert', 'EventController@store');
    $router->put('events/update/{id}', 'EventController@update');
    $router->delete('events/delete/{id}', 'EventController@destroy');
    $router->get('events/{id}', 'EventController@show');
    $router->get('events/dropdown/wings', 'EventController@dropDown');
    $router->post('events_all', 'EventController@allEvents');
    $router->post('events/dropdown/filter', 'EventController@filter');
    $router->post('events/reg/website', 'EventController@eventRegistration');
    $router->get('reg_all', 'EventController@allRegistrations');
    $router->delete('reg/delete/{id}', 'EventController@registrationsDestroy');
    $router->post('/events/get', 'EventController@tableData');
    $router->get('public/events/getPageInfo', 'EventController@pageInfo');
    $router->post('public/events/register', 'EventController@eventParticipantRegistration');
    $router->put('events/updateGallery/{id}', 'EventController@updateEventGallery');
    $router->get('events/speakers/{id}', 'EventController@getEventSpeaker');
    $router->post('events/saveEventSpeaker', 'EventController@saveEventSpeaker');
    $router->put('events/updateEventSpeaker/{id}', 'EventController@updateEventSpeaker');
    $router->delete('events/deleteEventSpeaker/{id}', 'EventController@deleteEventSpeaker');
    // $router->get('notify/events/{id}', 'EventController@notifyEventMembers');
    $router->get('notify/events/{id}/{userId}', 'EventController@notifyEventMembers');


    //for roles
    $router->post('/roles', 'RolesController@index');
    $router->post('/roles/insert', 'RolesController@store');
    $router->put('roles/update/{id}', 'RolesController@update');
    $router->delete('roles/delete/{id}', 'RolesController@destroy');
    $router->get('roles/{id}', 'RolesController@show');
    $router->get('roles/dropdown/list', 'RolesController@rolesDrop');
    $router->post('/roles/get', 'RolesController@tableData');

    //for banners
    $router->get('/banners', 'BannerController@index');
    $router->post('/banners/insert', 'BannerController@store');
    $router->put('banners/update/{id}', 'BannerController@update');
    $router->delete('banners/delete/{id}', 'BannerController@destroy');
    $router->get('banners/{id}', 'BannerController@show');

    //for meeting
    $router->post('/meeting', 'MeetingController@index');
    $router->post('/meeting/insert', 'MeetingController@store');
    $router->put('meeting/update/{id}', 'MeetingController@update');
    $router->delete('meeting/delete/{id}', 'MeetingController@destroy');
    $router->get('meeting/{id}', 'MeetingController@show');
    $router->get('meeting/archieve/manual/{id}', 'MeetingController@manualArchieve');
    $router->post('/meeting/get', 'MeetingController@tableData');
    $router->post('meeting/create_mom', 'MeetingController@createMom');
    $router->post('archive/meeting', 'MeetingController@archiveTableData');
    $router->get('latest/meeting', 'MeetingController@latestTableData');
    $router->get('notify/meeting/{id}', 'MeetingController@notifyMeetingMembers');

    //for resource
    $router->post('/resource', 'ResourcesController@index');
    $router->post('/resource/insert', 'ResourcesController@store');
    $router->put('resource/update/{id}', 'ResourcesController@update');
    $router->delete('resource/delete/{id}', 'ResourcesController@destroy');
    $router->get('resource/{id}', 'ResourcesController@show');
    $router->get('resource/archieve/manual/{id}', 'ResourcesController@manualArchive');
    $router->post('/resource/get', 'ResourcesController@tableData');
    $router->get('public/resource', 'ResourcesController@publicData');

    //for carrier
    $router->post('/carrier', 'CarrierController@index');
    $router->get('/carrier/archieve/manual/{id}', 'CarrierController@manualArchive');
    $router->post('carrier/search/data', 'CarrierController@search');
    $router->post('/carrier/insert', 'CarrierController@store');
    $router->get('carrier/{id}', 'CarrierController@show');
    $router->put('carrier/update/{id}', 'CarrierController@update');
    $router->delete('carrier/delete/{id}', 'CarrierController@destroy');
    $router->post('carrier/dropdown/filter', 'CarrierController@filter');
    $router->get('carrier_all', 'CarrierController@allCarrier');
    $router->post('/carrier/get', 'CarrierController@tableData');
    $router->post('/carrier/personal/get', 'CarrierController@tableDataPersonalized');

    //for documents
    $router->post('/documents', 'DocumentController@index');
    $router->get('/documents/archieve/manual/{id}', 'DocumentController@manualArchive');
    $router->post('/documents/dropdown/category/{id}', 'DocumentController@showByCategory');
    $router->post('documents/search/data', 'DocumentController@search');
    $router->post('/documents/insert', 'DocumentController@store');
    $router->get('documents/{id}', 'DocumentController@show');
    $router->get('documents_all', 'DocumentController@allDocuments');
    $router->put('documents/update/{id}', 'DocumentController@update');
    $router->delete('documents/delete/{id}', 'DocumentController@destroy');
    $router->post('documents/dropdown/filter', 'DocumentController@filter');
    $router->post('/documents/get', 'DocumentController@tableData');

    //for category (documents and category both are in document controller)
    $router->post('/category/insert', 'DocumentController@categoryAdd');
    $router->put('category/update/{id}', 'DocumentController@updateCategory');
    $router->delete('category/delete/{id}', 'DocumentController@destroyCategory');
    $router->get('category/{id}', 'DocumentController@showCategory');
    $router->get('category/dropdown/list', 'DocumentController@categoryDrop');

    //for mom meeting of minutes
    $router->post('/moms', 'MomController@index');
    $router->post('/moms/insert', 'MomController@store');
    $router->put('moms/update/{id}', 'MomController@update');
    $router->delete('moms/delete/{id}', 'MomController@destroy');
    $router->get('moms/{id}', 'MomController@show');
    $router->get('moms/dropdown/events', 'MomController@eventsDrop');
    $router->get('moms/archieve/manual/{id}', 'MomController@manualArchieve');
    $router->post('moms/search/data', 'MomController@search');
    $router->post('moms/dropdown/filter', 'MomController@filter');
    $router->get('mom_all', 'MomController@allMom');
    $router->post('/moms/get', 'MomController@tableData');
    $router->post('archive/moms', 'MomController@archiveTableData');
    $router->get('latest/moms', 'MomController@latestTableData');
    $router->post('moms/approve', 'MomController@approveMom');

    //in home page |latest events| and |latest carrier| and |recent events attended based on user|
    $router->post('/internal_home/latest_events', 'InternalHomeController@latestEvents');
    $router->post('/internal_home/latest_carrier', 'InternalHomeController@latestCarrier');
    $router->post('/internal_home/events_attend', 'InternalHomeController@EventsAttend');

    //in home page and all pages user info api
    $router->get('/internal_home/auth_user/{user_id}', 'InternalHomeController@userDetails');

    //feed controller for feed photo video article
    $router->post('/feeds', 'InternalFeedController@index');
    // $router->post('/feeds/upload/{id}', 'InternalFeedController@allFeeds');
    // $router->post('feeds/upload_video/{id}', 'InternalFeedController@video');
    // $router->post('feeds/article/{id}', 'InternalFeedController@article');
    $router->post('feeds/insert', 'InternalFeedController@feedStore');
    $router->post('feeds/likes/', 'InternalFeedController@likesIncrement');
    $router->post('feeds/comments/', 'InternalFeedController@feedComment');
    $router->delete('feeds/comment_delete/{userID}', 'InternalFeedController@deleteComment');
    $router->post('feeds/user_feeds', 'InternalFeedController@userFeeds');
    $router->post('feeds/activity', 'InternalFeedController@Activity');
    $router->post('feed_single', 'InternalFeedController@singleFeed');
    $router->delete('feed_delete/{id}', 'InternalFeedController@deleteFeed');
    $router->get('feed_show/{id}', 'InternalFeedController@feedShow');
    $router->put('feed_update/{id}', 'InternalFeedController@feedUpdate');

    //all documents image videos upload api
    $router->post('files/upload', 'InternalFeedController@feedUpload');

    //for role permissions table
    $router->post('/role_permissions', 'RolePermissionController@index');
    $router->put('/role_permissions/insert/{user_id}', 'RolePermissionController@store');
    $router->put('role_permissions/update/{id}', 'RolePermissionController@update');
    $router->delete('role_permissions/delete/{id}', 'RolePermissionController@destroy');
    $router->get('role_permissions/{id}', 'RolePermissionController@show');
    $router->post('/role_permissions/get', 'RolePermissionController@tableData');

    //for getting user permissions based on role id after login
    $router->post('/denied_permissions/{user_id}', 'RolePermissionController@alterUserPermissions');

    //for permissions table
    $router->post('/permissions', 'PermissionController@index');
    $router->post('/permissions/insert', 'PermissionController@store');
    $router->put('permissions/update/{id}', 'PermissionController@update');
    $router->delete('permissions/delete/{id}', 'PermissionController@destroy');
    $router->get('permissions/{id}', 'PermissionController@show');
    $router->get('permissions/dropdown/list', 'PermissionController@permissionDrop');
    $router->get('dropdown/permissions', 'PermissionController@permissionDropDown');

    Route::post('sendNotification', 'FirebaseController@sendNotification');

});

$router->get('/key', function () {
    return \Illuminate\Support\Str::random(32);
});
