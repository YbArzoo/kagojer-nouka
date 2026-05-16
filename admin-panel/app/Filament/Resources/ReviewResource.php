<?php

namespace App\Filament\Resources;

use App\Models\Review;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use BackedEnum;
use UnitEnum;
use Filament\Support\Icons\Heroicon;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Actions\EditAction; // Explicitly imported

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedStar;
    protected static string|UnitEnum|null $navigationGroup = 'Marketing';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('product_id')
                    ->relationship('product', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                TextInput::make('customer_name')->required(),
                TextInput::make('rating')->numeric()->default(5)->minValue(1)->maxValue(5)->required(),
                Textarea::make('comment')->required()->columnSpanFull(),
                Toggle::make('is_approved')->label('Approve for Product Page')->default(false),
                Toggle::make('is_featured_on_home')->label('Feature in "Words from our Dreamers" (Homepage)')->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('product.name')->sortable()->searchable(),
                TextColumn::make('customer_name')->searchable(),
                TextColumn::make('rating')->sortable(),
                IconColumn::make('is_approved')->boolean(),
                IconColumn::make('is_featured_on_home')->boolean()->label('On Homepage?'),
            ]); // <-- End it right here! No more actions array.
    }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\ReviewResource\Pages\ListReviews::route('/'),
            'create' => \App\Filament\Resources\ReviewResource\Pages\CreateReview::route('/create'),
            'edit' => \App\Filament\Resources\ReviewResource\Pages\EditReview::route('/{record}/edit'),
        ];
    }
}