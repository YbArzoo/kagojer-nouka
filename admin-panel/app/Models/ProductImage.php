<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    // This line unlocks the model so Filament can save the image_url!
    protected $guarded = [];

    /**
     * Link the image back to its product
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}