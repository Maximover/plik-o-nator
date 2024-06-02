<?php

use App\Http\Controllers\UploadedFileController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminAuthentication;
use App\Http\Middleware\UserAuthentication;
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

Route::view('/{path?}', 'index');

Route::post('/api/user/verify', [UserController::class, 'verify']);
Route::post('/api/user/login', [UserController::class, 'login']);

Route::middleware(UserAuthentication::class)->group(function () {
    Route::resource('/api/uploaded_files', UploadedFileController::class);
    Route::get('/api/uploaded_files/download/{id}', [UploadedFileController::class, 'download']);
    Route::post('/api/user/quit', [UserController::class, 'logout']);
});
Route::middleware(AdminAuthentication::class)->group(function () {
    Route::post('/api/user/new', [UserController::class, 'new']);
    Route::get('/api/users', [UserController::class, 'index']);
});

