<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Response;

class UserController extends Controller
{
    /**
     * 
     */
    public function verify(Request $request) {
        $saved_user = $request->cookie('user') ?? null;
        if ($saved_user) {
            return response()->json(['user'=>$request->cookie('user')], 200);
        }
        return response()->json(['error'=>'Not verified'], 400);
    }

    public function new(Request $request) {
        try {
            $request->validate(['username'=>'required']);
        } catch (Exception $e) {
            return response()->json(['error'=>'Failed to create user'], 400);
        }
        $user = User::where('name', $request->username)->first();
        if ($request->cookie('user') != null or $user) {
            return response()->json(['msg'=>'User already exists', 'user'=>$user->name], 200)->withCookie('user', $user->name);
        }
        User::create(['name'=>$request->username]);
        return response()->json(['user'=>$request->username], 200)->withCookie('user', $request->username);
    }

    public function quit(Request $request) {
        return response()->json(['success'=>''], 200)->withoutCookie('user');
    }


}
