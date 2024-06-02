<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UploadedFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'caption',
        'path',
        'original_name',
        'mime_type'
    ];

    public function downloads() {
        return $this->hasMany(Download::class);
    }

    public function getFileExtension() {
        return last(explode('.', $this->original_name));
    }
}
