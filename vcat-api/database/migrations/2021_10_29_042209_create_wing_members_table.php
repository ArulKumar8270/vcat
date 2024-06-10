<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWingMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wing_members', function (Blueprint $table) {
            $table->id();
            $table->string('wing_role', 32);
            $table->integer('wing_id');
            $table->json('members');
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
        Schema::dropIfExists('wing_members');
    }
}
