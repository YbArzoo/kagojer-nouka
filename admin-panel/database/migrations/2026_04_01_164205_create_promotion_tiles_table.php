<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
    {
        Schema::create('promotion_tiles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('discount_text')->nullable(); // e.g., "30% DISCOUNT" or "NEW ARRIVAL"
            $table->string('image_path');
            $table->string('button_text')->default('SHOP NOW');
            $table->string('button_link')->nullable();
            $table->integer('priority')->default(0); // To sort which tile shows first
            $table->boolean('is_active')->default(true); // Toggle to hide/show easily
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_tiles');
    }
};
