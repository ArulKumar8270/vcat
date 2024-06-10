<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeedLikesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('feed_likes', function (Blueprint $table) {
            $table->id();
            $table->integer('likes')->default(0);
            $table->string('liked_user_id',256)->nullable();
            $table->string('feed_id',256)->nullable();
            $table->string('feed_name',256)->nullable();
            $table->softDeletes();
            $table->timestamps();


        });
    }
    

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('feed_likes');
    }
}
