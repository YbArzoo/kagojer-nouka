<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::table('categories', function (Blueprint $table) {
            // This allows a category (Paint) to belong to a parent (Art Supplies)
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            // Toggle to show it in the top navigation strip
            $table->boolean('is_in_nav')->default(false); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            //
        });
    }
};
