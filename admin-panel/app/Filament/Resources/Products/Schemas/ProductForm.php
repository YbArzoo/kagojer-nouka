<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\FileUpload;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->label('Category'),

                TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($operation, $state, $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),

                TextInput::make('base_price')
                    ->numeric()
                    ->prefix('৳')
                    ->required(),

                TextInput::make('cost_price')
                    ->label('Cost Price (China)')
                    ->numeric()
                    ->prefix('৳')
                    ->helperText('What you paid the supplier per unit')
                    ->required(),

                TextInput::make('stock_quantity')
                    ->label('Base Inventory / Stock')
                    ->numeric()
                    ->required()
                    ->default(0)
                    ->helperText('Use this for simple products. If the product has colors/sizes, use the variants section below.'),

                // --- MARKETING FLAGS START HERE ---
                Toggle::make('is_featured')
                    ->label('Feature on Homepage? (Editor\'s Choice)')
                    ->default(false),

                // We replaced is_popular with is_new_arrival
                Toggle::make('is_new_arrival')
                    ->label('Mark as New Arrival?')
                    ->default(true),
                // --- MARKETING FLAGS END HERE ---

                Textarea::make('description')
                    ->columnSpanFull()
                    ->rows(4),

                Repeater::make('variants')
                    ->relationship()
                    ->label('Product Variants (Colors & Sizes)')
                    ->schema([
                        TextInput::make('color')
                            ->label('Color')
                            ->placeholder('e.g., Mint Green, Sakura Pink')
                            ->nullable(),

                        TextInput::make('size')
                            ->label('Size')
                            ->placeholder('e.g., A4, Standard, 0.5mm')
                            ->nullable(),

                        TextInput::make('stock_quantity')
                            ->label('Stock Received')
                            ->numeric()
                            ->required()
                            ->default(0)
                            ->helperText('How many of this specific variant arrived?'),

                        TextInput::make('price_adjustment')
                            ->label('Price Adjustment (৳)')
                            ->numeric()
                            ->default(0)
                            ->helperText('Add extra cost if this variant is more expensive. Leave at 0 if same as base price.'),

                        FileUpload::make('image')
                            ->label('Variant Specific Image')
                            ->image()
                            ->disk('real_public') // Force it to our public folder!
                            ->directory('product-gallery')
                            ->nullable()
                            ->helperText('Optional: Upload an image specific to this color.'),
                    ])
                    ->columns(2)
                    ->defaultItems(0)
                    ->addActionLabel('Add Variant Combination')
                    ->reorderableWithButtons()
                    ->collapsible()
                    ->columnSpanFull(),

                Repeater::make('images')
                    ->relationship()
                    ->schema([
                        FileUpload::make('image_url')
                            ->label('Gallery Image')
                            ->image()
                            ->disk('real_public') // <-- THE MAGIC KEY!
                            ->directory('product-gallery')
                            ->helperText('Recommended: 1200 x 1500 px (Portrait). High-res vertical shots make stationery look premium.')
                            ->required(),
                        Toggle::make('is_thumbnail')
                            ->label('Use as Main Preview?')
                            ->default(false),
                    ])


                    ->grid(2)
                    ->columnSpanFull()
            ]);
    }
}