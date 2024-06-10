<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Carrier_attachment extends Model
{   
    use SoftDeletes;

    protected $fillable = [
        'carrier_docspath',
        'tags',
        'file_name'
    ];
}
