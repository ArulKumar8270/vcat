<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Page extends Model
{
    use SoftDeletes;
      /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'page', 'title', 'content', 'option_1', 'option_2', 'status', 'title_limit', 'content_limit'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */

}
