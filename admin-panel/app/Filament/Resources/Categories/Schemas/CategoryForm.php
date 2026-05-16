<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;     // NEW IMPORT
use Filament\Forms\Components\FileUpload; // NEW IMPORT
use Filament\Forms\Components\Toggle;     // NEW IMPORT
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($operation, $state, $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),

                // --- NEW ENTERPRISE FIELDS START HERE ---

                Select::make('parent_id')
                    ->label('Parent Category')
                    ->relationship('parent', 'name')
                    ->helperText('Leave empty if this is a Main Category (like "Art Supplies")')
                    ->searchable()
                    ->preload(),

                FileUpload::make('image')
                    ->label('Category Image')
                    ->image()
                    ->disk('real_public')
                    ->directory('categories')
                    ->helperText('Recommended: 800 x 800 px (Square). This ensures the collection circles look sharp.')
                    ->required(),

                Toggle::make('is_in_nav')
                    ->label('Show in Top Navigation Strip?')
                    ->default(false),
                    
                // --- NEW ENTERPRISE FIELDS END HERE ---
            ]);
    }
}