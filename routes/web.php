<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('auth/login');
});

Auth::routes();


Route::group(['prefix' => 'admin', 'middleware' => 'auth',] , function () {
    Route::get('/', 'AdminController@index')->name('admin');
});

Route::group(['prefix' => 'user', 'middleware' => 'auth',] , function () {
    Route::get('/', 'UserController@index')->name('user');
});

Route::group(['prefix' => 'driver', 'middleware' => 'auth',] , function () {
    Route::get('/', 'DriverController@index')->name('driver');
});

