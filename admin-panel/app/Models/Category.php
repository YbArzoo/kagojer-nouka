<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // Import this for better IDE support

class Category extends Model
{
    protected $guarded = [];

    // --- NEW: The bridge to products ---
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // A category can have sub-categories
    public function children() {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // A category belongs to a parent
    public function parent() {
        return $this->belongsTo(Category::class, 'parent_id');
    }
}