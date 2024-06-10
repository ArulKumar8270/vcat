<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCarrierAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carrier_attachments', function (Blueprint $table) {
            $table->id();
            $table->string('carrier_docspath',256)->nullable();
            $table->string('file_name',256)->nullable();
            $table->boolean('is_archive')->default(0);  
            $table->json('tags')->nullable();
            $table->string('created_by',256)->nullable();
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
        Schema::dropIfExists('carrier_attachments');
    }
}
