<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab; // 🚨 WE ARE BACK TO THE CORRECT V3 PATH!
use Illuminate\Database\Eloquent\Builder;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'active' => Tab::make('Active Orders 📦')
                ->badge(\App\Models\Order::whereNotIn('status', ['delivered', 'cancelled'])->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->whereNotIn('status', ['delivered', 'cancelled'])),
                
            'delivered' => Tab::make('Delivered (History) ✅')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'delivered')),
                
            'cancelled' => Tab::make('Cancelled ❌')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'cancelled')),
                
            'all' => Tab::make('All Orders')
                ->modifyQueryUsing(fn (Builder $query) => $query),
        ];
    }
}