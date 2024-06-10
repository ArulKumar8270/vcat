<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('category_id', 256)->nullable();
            $table->string('document_path', 256)->nullable();
            $table->string('link', 512)->nullable();
            $table->string('file_name', 256)->nullable();
            $table->boolean('is_archive')->default(0);
            $table->string('created_by', 256)->nullable();
            $table->string('modified_by')->nullable();
            $table->json('tags')->nullable();
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
        Schema::dropIfExists('documents');
    }
}