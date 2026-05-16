<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CouponResource\Pages;
use App\Models\Coupon;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class CouponResource extends Resource
{
    protected static ?string $model = Coupon::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-ticket';
    
    protected static string|\UnitEnum|null $navigationGroup = 'Marketing';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255)
                    ->placeholder('e.g., KAGOJER10')
                    ->helperText('The exact code the customer will type at checkout.'),

                Select::make('type')
                    ->required()
                    ->options([
                        'percentage' => 'Percentage Discount (%)',
                        'fixed' => 'Fixed Amount Discount (৳)',
                    ])
                    ->default('percentage'),

                TextInput::make('value')
                    ->required()
                    ->numeric()
                    ->placeholder('e.g., 10 or 50')
                    ->helperText('If percentage, enter 10 for 10%. If fixed, enter 50 for ৳50 off. Put 0 if this is ONLY a Free Shipping coupon.'),

                // --- NEW ADVANCED RULES ---
                Toggle::make('is_free_shipping')
                    ->label('Includes Free Shipping?')
                    ->default(false)
                    ->helperText('If turned on, the customer will not be charged the standard ৳60 shipping fee.'),

                TextInput::make('minimum_spend')
                    ->numeric()
                    ->placeholder('e.g., 500')
                    ->helperText('Optional: The minimum cart subtotal required to use this coupon.'),

                DateTimePicker::make('starts_at')
                    ->label('Valid From')
                    ->helperText('Optional: Leave blank to make it active immediately.'),

                DateTimePicker::make('expires_at')
                    ->label('Valid Until')
                    ->helperText('Optional: Leave blank if the coupon never expires.'),

                // --------------------------

                Toggle::make('is_active')
                    ->label('Active Status')
                    ->default(true)
                    ->helperText('Turn this off to temporarily disable the coupon entirely.'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->color('primary'),

                TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'percentage' => 'info',
                        'fixed' => 'success',
                    }),

                TextColumn::make('value')
                    ->numeric()
                    ->sortable(),

                // Visual indicator for free shipping in the table!
                IconColumn::make('is_free_shipping')
                    ->boolean()
                    ->label('Free Ship'),

                ToggleColumn::make('is_active')
                    ->label('Active'),

                // Hidden by default, but you can toggle them on in the table view
                TextColumn::make('minimum_spend')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                // Safely removed to avoid namespace crashes! 
                // Clicking the row will automatically open the edit page.
            ])
            ->bulkActions([
                // Safely removed!
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCoupons::route('/'),
            'create' => Pages\CreateCoupon::route('/create'),
            'edit' => Pages\EditCoupon::route('/{record}/edit'),
        ];
    }
}