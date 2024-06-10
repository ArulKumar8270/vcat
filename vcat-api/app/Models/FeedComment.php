<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedComment extends Model
{
    protected $fillable = [
        'comment',
        'commented_user_id',
        'feed_id',
        'feed_name',

    ];

    /**
     * Get the address information
     *
     * @return void
     */
    public function likedUsers()
    {
        return $this->belongsTo(User::class, 'liked_user_id', 'id');
    }

}
