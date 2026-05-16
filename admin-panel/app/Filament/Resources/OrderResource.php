<?php

namespace App\Filament\Resources;

use App\Models\Order;
use App\Models\Product;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\Layout\Split;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-shopping-cart';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Customer Details')
                    ->schema([
                        TextInput::make('customer_name')->required(),
                        TextInput::make('phone_number')->required(),
                        Textarea::make('shipping_address')->required()->columnSpanFull(),
                    ])->columns(2),

                Section::make('Order Items')
                    ->schema([
                        Repeater::make('items')
                            ->relationship('items')
                            ->live()
                            ->afterStateUpdated(function ($get, $set) {
                                $total = 0;
                                foreach ((array) $get('items') as $item) {
                                    $total += (float) ($item['price_at_purchase'] ?? 0) * (int) ($item['quantity'] ?? 1);
                                }
                                $set('total_amount', $total);
                            })
                            ->schema([
                                Select::make('product_id')
                                    ->relationship('product', 'name')
                                    ->required()
                                    ->disableOptionsWhenSelectedInSiblingRepeaterItems()
                                    ->live()
                                    ->afterStateUpdated(function ($state, $set) {
                                        $price = Product::find($state)?->base_price ?? 0;
                                        $set('price_at_purchase', $price);
                                    }),
                                TextInput::make('quantity')
                                    ->numeric()
                                    ->default(1)
                                    ->required()
                                    ->live(),
                                TextInput::make('price_at_purchase')
                                    ->label('Unit Price')
                                    ->numeric()
                                    ->prefix('৳')
                                    ->required()
                                    ->readOnly(),
                            ])->columns(3)
                    ]),

                Section::make('Order Financials')
                    ->description('Coupon and shipping breakdown from checkout')
                    ->schema([
                        TextInput::make('coupon_code')
                            ->label('Coupon Applied')
                            ->disabled() 
                            ->placeholder('No coupon used'),
                        
                        TextInput::make('discount_amount')
                            ->label('Discount Value')
                            ->numeric()
                            ->prefix('৳')
                            ->disabled(),
                            
                        TextInput::make('shipping_fee')
                            ->label('Shipping Fee')
                            ->numeric()
                            ->prefix('৳')
                            ->disabled(),
                    ])->columns(2)->collapsible(),

                Section::make('Order Status & Payment')
                    ->schema([
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending (New Order)',
                                'processing' => 'Processing (Packing)',
                                'shipped' => 'Shipped (With Courier)',
                                'delivered' => 'Delivered',
                                'cancelled' => 'Cancelled',
                            ])->required()->default('pending'),
                        TextInput::make('total_amount')
                            ->label('Grand Total')
                            ->numeric()
                            ->prefix('৳')
                            ->readOnly()
                            ->required()
                            ->extraInputAttributes(['class' => 'font-bold text-primary-600']),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->contentGrid([
                'md' => 2, 
                'xl' => 3, 
            ])
            ->columns([
                Stack::make([
                    Split::make([
                        TextColumn::make('customer_name')
                            ->weight('bold')
                            ->size('TextColumnSize::Large'),
                        TextColumn::make('created_at')
                            ->dateTime('d M, h:i A')
                            ->color('gray')
                            ->alignEnd(),
                    ]),

                    TextColumn::make('phone_number')
                        ->icon('heroicon-m-phone')
                        ->color('gray'),
                    TextColumn::make('shipping_address')
                        ->icon('heroicon-m-map-pin')
                        ->color('gray')
                        ->limit(40), 

                    TextColumn::make('formatted_items')
                        ->getStateUsing(function (Order $record) {
                            return $record->items->map(function ($item) {
                                $productName = $item->product ? $item->product->name : 'Unknown Item';
                                return $item->quantity . 'x ' . $productName;
                            })->implode('  •  ');
                        })
                        ->badge()
                        ->color('info')
                        ->icon('heroicon-m-shopping-bag'),

                    Split::make([
                        TextColumn::make('total_amount')
                            ->money('BDT')
                            ->prefix('৳')
                            ->weight('bold')
                            ->size('TextColumnSize::Large'),
                        
                        SelectColumn::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'processing' => 'Processing',
                                'shipped' => 'Shipped',
                                'delivered' => 'Delivered',
                                'cancelled' => 'Cancelled',
                            ]),
                    ])->extraAttributes(['class' => 'mt-4 items-center']), 
                ])->space(3) 
            ])
            ->filters([])
            ->actions([])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            // 🚨 THE BULLETPROOF FIX 🚨
            'index' => \App\Filament\Resources\OrderResource\Pages\ListOrders::route('/'),
            'create' => \App\Filament\Resources\OrderResource\Pages\CreateOrder::route('/create'),
            'edit' => \App\Filament\Resources\OrderResource\Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}