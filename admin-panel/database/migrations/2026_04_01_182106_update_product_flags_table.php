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
        Schema::table('products', function (Blueprint $table) {
            // Drop old manual "Popular" flag if it exists
            if (Schema::hasColumn('products', 'is_popular')) { $table->dropColumn('is_popular'); }
            
            // Add new flags
            $table->boolean('is_new_arrival')->default(true); // Manually flag as new
            $table->integer('total_sales_count')->default(0); // Automatic counter for Bestsellers
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
