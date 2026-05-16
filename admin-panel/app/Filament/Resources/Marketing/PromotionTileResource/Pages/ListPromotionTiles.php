<?php
namespace App\Filament\Resources\Marketing\PromotionTileResource\Pages;
use App\Filament\Resources\Marketing\PromotionTileResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPromotionTiles extends ListRecords {
    protected static string $resource = PromotionTileResource::class;
    protected function getHeaderActions(): array { return [Actions\CreateAction::make()]; }
}