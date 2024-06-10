<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class EventSpeaker extends Model
{
  use SoftDeletes;
       /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',  'image'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */

}
