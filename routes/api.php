<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('tripay/callback', [\App\Http\Controllers\TripayCallbackController::class, 'handle'])
    ->name('api.tripay.callback');
