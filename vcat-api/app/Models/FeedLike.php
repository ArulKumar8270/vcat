<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedLike extends Model
{
    protected $fillable = [
        'likes',
        'liked_user_id',
        'feed_id',
        'feed_name',

    ];

    // public function getFeed()
    // {
    //     return $this->belongsTo('App\Models\Feed', 'feed_id', 'id');
    // }
    public function likedUsers()
    {
        return $this->belongsTo(User::class, 'liked_user_id', 'id');
    }

}
