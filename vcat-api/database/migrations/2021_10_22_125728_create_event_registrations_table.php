<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventRegistrationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('event_id')->nullable();
            $table->string('name', 32)->nullable();
            $table->string('email')->nullable();
            $table->bigInteger('mobile_number')->nullable();
            $table->json('wing_rank', 64)->nullable();
            $table->string('description', 512)->nullable();
            $table->string('icai_membership_no', 50)->nullable();
            $table->string('vcat_membership_status', 50)->nullable();
            $table->string('message', 512)->nullable();
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
        Schema::dropIfExists('event_registrations');
    }
}
