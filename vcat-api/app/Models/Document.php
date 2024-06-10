<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'document_path',
        'file_name',
        'created_by',
        'name',
    ];
    protected $casts = [

        'created_at' => "datetime:Y-m-d",

    ];
}
