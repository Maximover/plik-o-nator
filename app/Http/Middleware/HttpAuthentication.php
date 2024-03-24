<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HttpAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // proceed
        if ($request->cookie('user') !== null)
            return $next($request);
        // abort
        return response()->json(['error'=>'Not Authorized'], 401);
    }
}
