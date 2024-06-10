<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name', 64);
            $table->integer('code');
            $table->text('description');
            $table->string('image', 128)->nullable();
            $table->json('hosted_by');
            $table->datetime('from_date');
            $table->datetime('to_date');
            $table->string('city');
            $table->enum('meeting_type', ['on_site', 'virtual', 'hybrid']);
            $table->enum('event_type', ['internal', 'external'])->nullable();
            $table->text('venue')->nullable();
            $table->json('wings')->nullable();
            $table->json('members')->nullable();
            $table->string('agenda')->nullable();
            $table->text('topic')->nullable();
            $table->string('prsentation_material')->nullable();
            $table->string('option_1', 128)->nullable();
            $table->string('created_by', 32)->nullable();
            $table->string('modified_by', 32)->nullable();
            $table->boolean('status')->default(0);
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
        Schema::dropIfExists('events');
    }
}