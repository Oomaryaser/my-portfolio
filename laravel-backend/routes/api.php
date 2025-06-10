<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImageController;

Route::get('/images', [ImageController::class, 'index']);
Route::post('/upload', [ImageController::class, 'store']);
Route::delete('/images/{id}', [ImageController::class, 'destroy']);
