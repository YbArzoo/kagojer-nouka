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
        Schema::create('homepage_settings', function (Blueprint $table) {
            $table->id();
            // Announcement Bar
            $table->string('announcement_text')->nullable();
            $table->string('announcement_bg_color')->default('#1E3A8A'); // Default brand blue
            $table->boolean('is_announcement_active')->default(true);
            // Special Featured Category (The "Premium Bullet Journal" block)
            $table->foreignId('featured_category_id')->nullable()->constrained('categories');
            // Optional Sections Toggles
            $table->boolean('is_reviews_section_active')->default(true);
            $table->timestamps();
        });
        
        // Seed default settings so API doesn't crash
        \Illuminate\Support\Facades\DB::table('homepage_settings')->insert([
            'announcement_text' => '✨ Welcome to Kagojer Nouka | Free shipping over ৳1500 ✨',
            'is_announcement_active' => true,
            'created_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homepage_settings');
    }
};
