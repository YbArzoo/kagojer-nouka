<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = []; // Allows us to save data freely

    // This is the magic bridge!
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}