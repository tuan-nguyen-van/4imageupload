<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImageController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'create'])->name('home');
Route::post('/save-image', [ImageController::class, 'save'])->name('save-image');
Route::post('/save-image-order', [ImageController::class, 'saveImageOrder'])->name('save-image-order');
Route::post('/delete-image', [ImageController::class, 'deleteImage'])->name('delete-image');
Route::get('/delete-image-number-null', [ImageController::class, 'deleteImageWhereImageNumberNull']);
Route::post('/download-code', [HomeController::class, 'downloadCode'])->name('download-code');
Route::get('/count', [HomeController::class, 'getCountDownload'])->name('get-count-download');
Route::get('/test-demo', [HomeController::class, 'testDemo'])->name('test-demo');
