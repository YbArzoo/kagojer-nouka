<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StorefrontController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/homepage', [StorefrontController::class, 'getHomepageData']);
Route::get('/products', [App\Http\Controllers\Api\StorefrontController::class, 'getProducts']);
Route::get('/products/{slug}', [StorefrontController::class, 'getProduct']);
Route::get('/categories/{slug}', [StorefrontController::class, 'getCategoryProducts']);
Route::get('/search', [StorefrontController::class, 'search']);
Route::post('/checkout', [StorefrontController::class, 'checkout']);
Route::get('/navigation', [\App\Http\Controllers\Api\StorefrontController::class, 'getNavigation']);
Route::post('/apply-coupon', [\App\Http\Controllers\Api\StorefrontController::class, 'applyCoupon']);