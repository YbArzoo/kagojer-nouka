<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('category.name')
                    ->label('Category')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('base_price')
                    ->label('Price')
                    ->prefix('৳')
                    ->sortable(),

                TextColumn::make('stock_quantity')
                    ->label('Stock')
                    ->numeric()
                    ->sortable(),

                IconColumn::make('is_featured')
                    ->label('Featured?')
                    ->boolean()
                    ->sortable(),

                // --- NEW POPULAR COLUMN ---
                IconColumn::make('is_new_arrival')
                    ->label('New?')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('total_sales_count')
                    ->label('Total Sold')
                    ->numeric()
                    ->sortable(),


                TextColumn::make('created_at')
                    ->label('Date Added')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('profit_margin')
                    ->label('Margin %')
                    ->state(function ($record) {
                        if ($record->base_price <= 0) return '0%';
                        $profit = $record->base_price - $record->cost_price;
                        $margin = ($profit / $record->base_price) * 100;
                        return number_format($margin, 0) . '%';
                    })
                    ->badge()
                    ->color(fn (string $state): string => match (true) {
                        (int) $state >= 50 => 'success', // High Profit (Star)
                        (int) $state >= 20 => 'warning', // Healthy
                        default => 'danger',             // Low Margin
                    })
                    ->description(fn ($record) => (int) (($record->base_price - $record->cost_price) / ($record->base_price ?: 1) * 100) >= 50 ? '⭐ Star Product' : ''),
            ]);
    }
}