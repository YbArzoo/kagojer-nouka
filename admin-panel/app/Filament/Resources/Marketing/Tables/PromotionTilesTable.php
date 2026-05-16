<?php

namespace App\Filament\Resources\Marketing\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction; // Correct unified namespace
use Filament\Actions\DeleteBulkAction; // Correct unified namespace
use Filament\Actions\ActionGroup;

class PromotionTilesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Image'),
                
                TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('discount_text')
                    ->label('Badge'),
                
                TextColumn::make('priority')
                    ->sortable(),
                
                IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
            ])
            ->bulkActions([
                ActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}