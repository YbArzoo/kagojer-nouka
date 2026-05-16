<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $actualSales = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $inventoryRevenue = Product::sum(DB::raw('base_price * stock_quantity'));

        return [
            Stat::make('Total Sales', '৳' . number_format($actualSales, 2))
                ->description('Real money from orders')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),

            Stat::make('Inventory Value', '৳' . number_format($inventoryRevenue, 2))
                ->description('Total potential sales')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info'),

            Stat::make('Active Items', Product::count())
                ->description('Total unique products')
                ->descriptionIcon('heroicon-m-shopping-bag'),
        ];
    }
}