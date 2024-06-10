<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Feed extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'feed_paths',
        'feed_name',
        'like_count',
        'discription',
    ];

    /**
     * Get the address information
     *
     * @return void
     */
    public function getComments()
    {
        return $this->hasMany(FeedComment::class);
    }

    public function getLikes()
    {
        return $this->hasMany(FeedLike::class);
    }
    public function getFeeds()
    {
        return $this->hasMany(Feed::class);
    }

    public function feedUsers()
    {
        return $this->hasMany('App\Models\User', 'id', 'user_id');
    }

}
