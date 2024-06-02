<?php

namespace App\Http\Controllers;

use App\Models\Download;
use App\Models\UploadedFile;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class UploadedFileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function index(Request $request)
    {
        $sort_by = $request->get('sort', 'asc');
        $per_page = (int)$request->get('per_page', 12);
        $files = UploadedFile::withCount('downloads')->orderBy("created_at", $sort_by);
        return $files->paginate($per_page);
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
            $request->validate(['caption'=>'required', 'file'=>'required']);
            $user_id = User::where('name', Auth::user()->name)->firstOrFail()->id;
        } catch (Exception $e) {
            return response()->json(['error'=>'Failed to create resource', $e, 'cookie'=> Auth::user()->name, $request->caption, $request->file], 400);
        }
        $file = $request->file('file');
        if ($file->isValid() === false) {
            return response()->json(['error'=>'Failed uploading file', 400]);
        }
        $file_path = $file->storeAs('uploaded_files', Str::uuid());
        $uploaded_file = UploadedFile::create(['user_id'=>$user_id, 'caption'=>$request->caption, 'path'=>$file_path, 'original_name'=>$file->getClientOriginalName(), 'mime_type'=>Storage::mimeType($file_path)]);
        return response()->json($uploaded_file, 201);
    }

    /**
     * Download the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function download(Request $request, int $id)
    {
        // $headers = [
        //     'Content-Type' => 'text/csv',
        //     'Content-Disposition' => 'attachment; filename="file.csv"',
        // ];
        try {
            $file = UploadedFile::findOrFail($id);
            Download::create(['user_id'=>Auth::user()->id, 'uploaded_file_id'=>$id]);
            return Storage::download($file->path, $file->caption);
        } catch (Exception $e) {
            return response()->json(['error'=> 'File not found'], 400);
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
        try {
            $file = UploadedFile::findOrFail($id);
            Storage::delete($file->path);
            $file->delete();
            return response()->json([], 200);
        } catch (Exception $e) {
            return response()->json(['error'=>'Failed to delete resource'], 400);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        abort(404);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function show($id)
    {
        try {
            $file = UploadedFile::findOrFail($id);
            return Storage::download($file->path, $file->caption);
        } catch (Exception $e) {
            return response()->json(['error'=> 'File not found'], 400);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        abort(404);
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
        abort(404);
    }
}
