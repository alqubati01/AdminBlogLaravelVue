<?php

use App\Http\Middleware\AdminCheck;
use Illuminate\Support\Facades\Route;

Route::prefix('app/')->middleware([AdminCheck::class])->group(function(){
    // tag
    Route::get('get_tags', 'AdminController@getTag');
    Route::post('create_tag', 'AdminController@addTag');
    Route::post('edit_tag', 'AdminController@editTag');
    Route::post('delete_tag', 'AdminController@deleteTag');
    // image
    Route::post('upload', 'AdminController@upload');
    Route::post('delete_image', 'AdminController@deleteImage');
    // category
    Route::get('get_category', 'AdminController@getCategory');
    Route::post('create_category', 'AdminController@addCategory');
    Route::post('edit_category', 'AdminController@editCategory');
    Route::post('delete_category', 'AdminController@deleteCategory');
    // admin
    Route::get('get_users', 'AdminController@getUsers');
    Route::post('create_user', 'AdminController@createUser');
    Route::post('edit_user', 'AdminController@editUser');
    // login
    Route::post('admin_login', 'AdminController@adminLogin');
    // role
    Route::get('get_roles', 'AdminController@getRoles');
    Route::post('create_role', 'AdminController@addRole');
    Route::post('edit_role', 'AdminController@editRole');
    Route::post('assign_roles', 'AdminController@assignRole');
    // blog
    Route::get('get_blogs', 'AdminController@getBlogs'); 
    Route::post('create_blog', 'AdminController@createBlog');
    Route::get('blog_single/{id}', 'AdminController@singleBlogItem');
    Route::post('update_blog/{id}', 'AdminController@updateBlog');
    Route::post('delete_blog', 'AdminController@deleteBlog');
});

// blog upload image
Route::post('createBlog', 'AdminController@uploadEditorImage');
// blog slug for test
Route::get('slug','AdminController@slug');
// blog relationship for test
Route::get('getBlogs', 'AdminController@getBlogs');

Route::get('/logout', 'AdminController@logout');
Route::get('/', 'AdminController@index');
Route::any('{slug}', 'AdminController@index');

// Route::get('/', function () {
//     return view('welcome');
//     // return response()->json([
//     //     'msg' => 'We should return only json...'
//     // ]);
// });

// Route::any('{slug}', function () {
//     return view('welcome'); 
// });
