<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;

class UserController extends Controller
{   
    use AuthenticatesUsers;

    public function index(Request $request) {
        $users = User::all();
        return response()->json($users, 200);
    }

    public function verify(Request $request) {
        $saved_user = Auth::user() ?? null;
        if ($saved_user) {
            return response()->json(['user'=>$saved_user], 200);
        }
        return response()->json(['error'=>'Not verified'], 400);
    }
    
    public function login(Request $request) {
        try {
            $request->validate([
                'username' => 'required',
                'password' => 'required'
            ]);
        } catch(Exception $e) {
            return response()->json(['error'=>'Invalid Credentials Entered'], 401);
        }
        if(Auth::attempt(['name'=>$request->username, 'password'=>$request->password], true)){
            return response()->json(['user'=>Auth::user()], 200)->withCookie('user', Auth::user());
        }
        return response()->json(['error'=>'Invalid Credentials Entered'], 401);
    }
    // Create new user
    public function new(Request $request) {
        try {
            $request->validate(['username'=>'required', 'password'=>'required']);
        } catch (Exception $e) {
            return response()->json(['error'=>'Failed to create user'], 400);
        }
        $user = User::where('name', $request->username)->first();
        if ($request->cookie('user') != null or $user) {
            return response()->json(['msg'=>'User already exists', 'user'=>$user->name], 200);
        }
        User::create(['name'=>$request->username, 'password'=>Hash::make($request->get('password'))]);
        return response()->json(['user'=>$request->username], 200);
    }

    public function logout(Request $request) {
        Session::flush();
        Auth::logout();
        return response()->json(['success'=>''], 200)->withoutCookie('user');
    }


}
