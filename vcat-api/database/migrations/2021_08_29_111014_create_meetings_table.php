<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeetingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title', 32);
            $table->json('hosted_by');
            $table->datetime('from_date');
            $table->datetime('to_date');
            $table->string('meeting_number', 32);
            $table->string('city', 32);
            $table->string('description', 512);
            $table->enum('meeting_type', ['on_site', 'virtual', 'hybrid']);
            $table->text('venue');
            $table->json('wings')->nullable();
            $table->json('members')->nullable();
            $table->string('members_present')->nullable();
            $table->string('co_opted_bot')->nullable();
            $table->string('leave_of_absence')->nullable();
            $table->string('invocation')->nullable();
            $table->string('welcome_address')->nullable();
            $table->string('created_by')->nullable();
            $table->string('modified_by')->nullable();
            $table->string('status')->default(0);
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
        Schema::dropIfExists('meetings');
    }
}