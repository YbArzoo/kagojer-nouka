<?php
namespace App\Filament\Resources\Marketing\PromotionTileResource\Pages;
use App\Filament\Resources\Marketing\PromotionTileResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPromotionTile extends EditRecord {
    protected static string $resource = PromotionTileResource::class;
    protected function getHeaderActions(): array { return [Actions\DeleteAction::make()]; }
}