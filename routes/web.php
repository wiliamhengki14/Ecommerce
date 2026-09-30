<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/menus/create', [MenuController::class, 'create'])->name('menus.create');
    Route::post('/menus', [MenuController::class, 'store'])->name('menus.store');
    Route::get('/menus', [MenuController::class, 'index'])->name('menus.index');
    Route::get('menus/{menu}', [MenuController::class, 'detail'])->name('menus.detail');
    Route::get('menus/{menu}/edit', [MenuController::class, 'edit'])->name('menus.edit');
    Route::put('menus/{menu}/update', [MenuController::class, 'update'])->name('menus.update');
    Route::delete('menus/{menu}/delete', [MenuController::class, 'delete'])->name('menus.delete');
    // cart
    Route::post('carts/{menu}', [CartController::class, 'add'])->name('carts.add');
    Route::post('carts/{menu}/decrement', [CartController::class, 'decrement'])->name('carts.decrement');
    Route::delete('carts/{menu}', [CartController::class, 'remove'])->name('carts.remove');
    Route::get('carts', [CartController::class, 'index'])->name('carts.index');
});

require __DIR__.'/auth.php';
