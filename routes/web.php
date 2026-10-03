<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/menus');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/menus', [MenuController::class, 'index'])->name('menus.index');

    Route::middleware('is_admin')->group(function () {
        Route::get('/menus/create', [MenuController::class, 'create'])->name('menus.create');
        Route::post('/menus', [MenuController::class, 'store'])->name('menus.store');
        Route::get('menus/{menu}/edit', [MenuController::class, 'edit'])->name('menus.edit');
        Route::put('menus/{menu}/update', [MenuController::class, 'update'])->name('menus.update');
        Route::delete('menus/{menu}/delete', [MenuController::class, 'delete'])->name('menus.delete');
    });

    Route::get('menus/{menu}', [MenuController::class, 'detail'])->name('menus.detail');
    // cart
    Route::post('/carts/{menu}', [CartController::class, 'add'])->name('carts.add');
    Route::post('/carts/{menu}/decrement', [CartController::class, 'decrement'])->name('carts.decrement');
    Route::delete('/menus/delete', [CartController::class, 'remove'])->name('carts.remove');
    Route::get('/carts', [CartController::class, 'index'])->name('carts.index');

    // order
    Route::post('/orders/add', [OrderController::class, 'order'])->name('orders.order');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}/show', [OrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}/completed', [OrderController::class, 'completed'])->name('orders.completed');
});

require __DIR__.'/auth.php';
