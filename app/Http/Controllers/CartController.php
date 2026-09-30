<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    // add 
    public function add(Menu $menu, Request $request) {
        $menu_id = $menu->id;
        $user_id = Auth::id();

        // ambil data keranjang
        $existingCart = Cart::where('menu_id', $menu_id)
            ->where('user_id', $user_id)
            ->first();
        if($existingCart == null) {
            $validasi = $request->validate([
                'quantity' => 'required|gte:1|lte:' . $menu->stock,
            ]);
            Cart::create([
                'user_id' => $user_id,
                'menu_id' => $menu_id,
                'quantity' => $validasi['quantity'],
            ]);
        } else {
            $validasi = $request->validate([
                'quantity' => 'required|gte:1|lte:' . ($menu->stock - $existingCart->quantity),
            ]);
            $existingCart->update([
                'quantity' => $validasi['quantity'] + $existingCart->quantity,
            ]);
        }
        return Redirect::route('carts.index')->with('message', 'Data berhasil di tambahkann');
    }

    // index
    public function index(): Response {
        $user = Auth::user();
        $carts = Cart::with(['menu'], ['user'])->where('user_id', $user->id)
            ->get();
        return Inertia::render('Carts/Index', [
            'carts' => $carts,
            'user' => $user,
        ]);
    }

    // decrement 
    public function decrement(Menu $menu) {
        $user_id = Auth::id();
        $menu_id = $menu->id;

        $existingCart = Cart::where('menu_id', $menu_id)
            ->where('user_id', $user_id)
            ->first();
        if($existingCart->quantity <= 1) {
            $existingCart->delete();
        }else {
            $existingCart->update([
                'quantity' => $existingCart->quantity - 1,
            ]);
        }
        return Redirect::back();
    }

    public function remove(Menu $menu) {
        $user_id = Auth::id();
        $cart = Cart::where('menu_id', $menu->id)
            ->where('user_id', $user_id)
            ->first();
        $cart->delete();
        return Redirect::back();
    }
}
