<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // THE AUTO-DEDUCTOR TRIGGER
    protected static function booted()
    {
        static::created(function ($orderItem) {
            $product = $orderItem->product;
            if ($product && $product->stock_quantity >= $orderItem->quantity) {
                // Subtract the ordered amount from the stock
                $product->decrement('stock_quantity', $orderItem->quantity);
            }
        });
    }
}