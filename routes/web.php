<?php

use App\Http\Controllers\UploadedFileController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\HttpAuthentication;
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
Route::post('/api/user/new', [UserController::class, 'new']);

Route::middleware(HttpAuthentication::class)->group(function () {
    Route::resource('/api/uploaded_files', UploadedFileController::class);
    Route::post('/api/uploaded_files/download', [UploadedFileController::class, 'download']);
    Route::post('/api/user/quit', [UserController::class, 'quit']);
});
