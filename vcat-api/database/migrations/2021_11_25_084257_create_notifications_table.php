<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->json('send_to', 32)->nullable();
            $table->string('notification_title', 64)->nullable();
            $table->string('notification_message', 512)->nullable();
            $table->json('readed_user', 32)->nullable();
            $table->string('event_reminder_id', 32)->nullable();
            $table->boolean('status')->default(0);
            $table->string('created_by', 32)->nullable();
            $table->string('modified_by', 32)->nullable();
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
        Schema::dropIfExists('notifications');
    }
}
