<?php

namespace App\Filament\Resources\OrderResource\Pages; // 🚨 CHANGED Orders TO OrderResource

use App\Filament\Resources\OrderResource;
use Filament\Resources\Pages\CreateRecord;

class CreateOrder extends CreateRecord
{
    protected static string $resource = OrderResource::class;
}