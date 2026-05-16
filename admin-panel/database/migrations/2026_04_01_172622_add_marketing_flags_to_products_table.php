<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            // Only add 'is_popular' since 'is_featured' already exists
            if (!Schema::hasColumn('products', 'is_popular')) {
                $table->boolean('is_popular')->default(false);
            }
        });
    }

    public function down(): void {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'is_popular')) {
                $table->dropColumn('is_popular');
            }
        });
    }
};