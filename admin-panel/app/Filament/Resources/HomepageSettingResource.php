<?php

namespace App\Filament\Resources;

use App\Models\HomepageSetting;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use BackedEnum;
use UnitEnum;
use Filament\Support\Icons\Heroicon;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ColorColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Actions\EditAction; // Explicitly imported

class HomepageSettingResource extends Resource
{
    protected static ?string $model = HomepageSetting::class;
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;
    protected static string|UnitEnum|null $navigationGroup = 'Marketing';
    protected static ?string $navigationLabel = 'Homepage Settings';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Removed the Section wrappers, just flat fields now!
                TextInput::make('announcement_text')
                    ->label('Text to display')
                    ->placeholder('e.g., Free shipping over ৳1500'),
                    
                ColorPicker::make('announcement_bg_color')
                    ->label('Background Color')
                    ->default('#5fa5fa'),
                    
                Toggle::make('is_announcement_active')
                    ->label('Show Announcement Bar?')
                    ->default(true),

                Select::make('featured_category_id')
                    ->label('Special Featured Category (Premium Block)')
                    ->options(\App\Models\Category::pluck('name', 'id'))
                    ->searchable()
                    ->preload(),
                    
                Toggle::make('is_reviews_section_active')
                    ->label('Show "Words from our Dreamers" Section?')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
        {
            return $table
                ->columns([
                    TextColumn::make('announcement_text')->limit(30),
                    ColorColumn::make('announcement_bg_color'),
                    IconColumn::make('is_announcement_active')->boolean(),
                    IconColumn::make('is_reviews_section_active')->boolean(),
                ]); // <-- End it right here! No more actions array.
        }

    public static function getRelations(): array { return []; }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\HomepageSettingResource\Pages\ListHomepageSettings::route('/'),
            'edit' => \App\Filament\Resources\HomepageSettingResource\Pages\EditHomepageSetting::route('/{record}/edit'),
        ];
    }
}