<?php

namespace App\Filament\Resources\Marketing;

use App\Filament\Resources\Marketing\BannerResource\Pages;
use App\Filament\Resources\Marketing\Tables\BannersTable;
use App\Models\Banner;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

class BannerResource extends Resource
{
    protected static ?string $model = Banner::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-megaphone';

    protected static string|\UnitEnum|null $navigationGroup = 'Marketing';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                FileUpload::make('image_path')
                    ->label('Hero Image')
                    ->image()
                    ->directory('marketing-banners')
                    ->imageEditor()
                    ->required()
                    ->helperText('Recommended size: 1920 x 800px (or 16:9 ratio) for perfect wide scaling.') // <-- Added this!
                    ->columnSpanFull(),
                
                TextInput::make('title')->required(),
                TextInput::make('subtitle'),
                TextInput::make('button_text')->default('Shop Now'),
                TextInput::make('button_link')->placeholder('e.g., /category/pens'),
                TextInput::make('priority')->numeric()->default(0),
                Toggle::make('is_active')->label('Is Active')->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return BannersTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBanners::route('/'),
            'create' => Pages\CreateBanner::route('/create'),
            'edit' => Pages\EditBanner::route('/{record}/edit'),
        ];
    }
}