<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Carbon\Carbon;

class MonthlySalesChart extends ChartWidget
{
    protected ?string $heading = 'Monthly Sales Growth';
    protected static ?int $sort = 2; // Puts it right below your stats

    protected function getData(): array
    {
        $data = [];
        $months = [];

        // Look at the last 6 months
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $months[] = $month->format('M');
            
            $sum = Order::where('status', '!=', 'cancelled')
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('total_amount');
                
            $data[] = $sum;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Sales (৳)',
                    'data' => $data,
                    'borderColor' => '#f472b6', // Sakura Pink line!
                    'fill' => 'start',
                ],
            ],
            'labels' => $months,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}