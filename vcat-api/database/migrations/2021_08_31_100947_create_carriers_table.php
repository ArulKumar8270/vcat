<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCarriersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carriers', function (Blueprint $table) {
            $table->id();
            $table->string('job_title', 32)->nullable();
            $table->string('company_name')->nullable();
            $table->string('job_type')->nullable();
            $table->datetime('date_time')->nullable();
            $table->string('salary', 32)->nullable();
            $table->string('salary_type', 32)->nullable();
            $table->string('location')->nullable();
            $table->string('job_description', 2000)->nullable();
            $table->string('requirements')->nullable();
            $table->string('about_company', 2000)->nullable();
            $table->boolean('is_archive')->default(0);
            $table->json('tags')->nullable();
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
        Schema::dropIfExists('carriers');
    }
}