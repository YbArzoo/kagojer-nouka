<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            // The Free Shipping Toggle
            $table->boolean('is_free_shipping')->default(false)->after('value');
            
            // The Minimum Spend Rule (Nullable, so you can leave it blank if no minimum is required)
            $table->decimal('minimum_spend', 8, 2)->nullable()->after('is_free_shipping');
            
            // The Date Limits (Nullable, so a coupon can last forever if you want)
            $table->dateTime('starts_at')->nullable()->after('is_active');
            $table->dateTime('expires_at')->nullable()->after('starts_at');
        });
    }

    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn(['is_free_shipping', 'minimum_spend', 'starts_at', 'expires_at']);
        });
    }
};