<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('moms', function (Blueprint $table) {
            $table->id();
            $table->string('year');
            $table->string('continuous');
            $table->string('meeting_number');
            $table->string('city');
            $table->datetime('date_time');
            $table->enum('meeting_type', ['on_site', 'virtual', 'hybrid']);
            $table->enum('event_type', ['internal', 'external']);
            $table->text('venue');
            $table->json('wings')->nullable();
            $table->json('members')->nullable();
            $table->json('members_present')->nullable();
            $table->json('co_opted_bot')->nullable();
            $table->json('leave_of_absence')->nullable();
            $table->string('invocation')->nullable();
            $table->string('welcome_address')->nullable();
            $table->text('content')->nullable();
            $table->boolean('status')->default(0);
            $table->string('events', 64)->nullable();
            $table->string('created_by')->nullable();
            $table->string('modified_by')->nullable();
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
        Schema::dropIfExists('moms');
    }
}