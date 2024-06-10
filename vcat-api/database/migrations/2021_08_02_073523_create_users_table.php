<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 32)->nullable();
            $table->string('cover_pic', 128)->nullable();
            $table->json('wings')->nullable();
            $table->string('icai_membership_no', 16)->nullable();
            $table->string('nominee_name', 32)->nullable();
            $table->string('qualification', 32)->nullable();
            $table->date('dob')->nullable();
            $table->string('blood_group', 32)->nullable();
            $table->string('occupation', 16)->nullable();
            $table->string('member_occupation', 64)->nullable();
            $table->enum('communication_address', ['office', 'residence'])->nullable();
            $table->text('office_address')->nullable();
            $table->text('residence_address')->nullable();
            $table->bigInteger('office_mobile')->nullable();
            $table->bigInteger('mobile_number')->nullable();
            $table->string('spouse_name', 32)->nullable();
            $table->date('spouse_dob')->nullable();
            $table->date('marriage_date')->nullable();
            $table->integer('nos_children')->nullable();
            $table->string('children_name_1', 32)->nullable();
            $table->string('children_name_2', 32)->nullable();
            $table->string('children_name_3', 32)->nullable();
            $table->boolean('status');
            $table->string('email')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}