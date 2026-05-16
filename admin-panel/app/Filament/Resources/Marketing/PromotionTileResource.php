<?php

namespace App\Filament\Resources\Marketing;

use App\Filament\Resources\Marketing\PromotionTileResource\Pages;
use App\Filament\Resources\Marketing\Tables\PromotionTilesTable;
use App\Models\PromotionTile;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

class PromotionTileResource extends Resource
{
    protected static ?string $model = PromotionTile::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-view-columns';
    
    protected static string|\UnitEnum|null $navigationGroup = 'Marketing';

    protected static ?string $recordTitleAttribute = 'title';
    
    protected static ?string $navigationLabel = 'Promo Tiles';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                FileUpload::make('image_path')
                    ->label('Tile Background Image')
                    ->image()
                    ->directory('marketing-tiles')
                    ->imageEditor()
                    ->required()
                    ->helperText('Recommended size: 800 x 600px (4:3 ratio) for a crisp 3-column grid.') // <-- Added this!
                    ->columnSpanFull(),
                
                TextInput::make('title')
                    ->required()
                    ->placeholder('e.g., Mechanical Pen Pencil 0.7mm'),
                
                TextInput::make('discount_text')
                    ->placeholder('e.g., 30% DISCOUNT'),
                
                TextInput::make('button_text')
                    ->default('SHOP NOW'),
                
                TextInput::make('button_link')
                    ->placeholder('e.g., /category/pens'),
                
                TextInput::make('priority')
                    ->numeric()
                    ->default(0)
                    ->helperText('Lower numbers show first (e.g., 1, 2, 3)'),
                
                Toggle::make('is_active')
                    ->label('Visible on Website')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        // Calling the decoupled table schema we just created
        return PromotionTilesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPromotionTiles::route('/'),
            'create' => Pages\CreatePromotionTile::route('/create'),
            'edit' => Pages\EditPromotionTile::route('/{record}/edit'),
        ];
    }
}