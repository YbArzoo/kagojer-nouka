<?php
namespace App\Filament\Resources\Marketing\BannerResource\Pages;
use App\Filament\Resources\Marketing\BannerResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListBanners extends ListRecords {
    protected static string $resource = BannerResource::class;
    protected function getHeaderActions(): array { return [Actions\CreateAction::make()]; }
}