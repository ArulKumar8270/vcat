<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTextarea1AndTextarea2AndBecomeAndPaymentTyoeToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('associate_org_member')->nullable();
            $table->text('associate_org_position')->nullable();
            $table->enum('become', ['life_trustee', 'member'])->nullable();
            $table->enum('payment_type', ['cash', 'online_transfer', 'cheque', 'dd'])->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
}