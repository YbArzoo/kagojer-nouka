<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromotionTile extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'discount_text',
        'image_path',
        'button_text',
        'button_link',
        'priority',
        'is_active',
    ];
}