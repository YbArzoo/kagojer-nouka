<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// THE GOD MODE MEDIA TUNNEL
Route::get('/media/{path}', function ($path) {
    // 1. Clean up any weird slashes automatically
    $cleanPath = str_replace(['//', '\\'], '/', rtrim($path, '/'));
    
    // 2. Search Location A: Standard Storage
    $storagePath = storage_path('app/public/' . $cleanPath);
    if (file_exists($storagePath)) {
        return response()->file($storagePath);
    }

    // 3. Search Location B: Public Folder (just in case Filament put it here)
    $publicPath = public_path($cleanPath);
    if (file_exists($publicPath)) {
        return response()->file($publicPath);
    }

    // 4. If nothing is found, return a safe fallback instead of a 404 error!
    return redirect('https://via.placeholder.com/600x600.png?text=Missing+File');
})->where('path', '.*');