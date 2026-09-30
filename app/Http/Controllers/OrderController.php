<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Menu;
use App\Models\Order;       // 👈 Wajib dari App\Models
use App\Models\OrderItem;   // 👈 Wajib dari App\Models
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function order() {
        $user_id = Auth::id();
        $carts = Cart::with('menu')->where('user_id', $user_id)->get();

        if($carts == null) {
            return Redirect::back();
        }else {
            $totalAmount = $carts->reduce(function ($total, $cart) {
                return $total + ($cart->menu ? $cart->menu->price * $cart->quantity : 0);
            }, 0);

            $order = Order::create([
                'user_id' => $user_id,
                'order_number' => 'ORD-' .strtoupper(Str::random(8)),
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'notes' => '',
            ]);

            foreach($carts as $cart) {
                $menu = Menu::find($cart->menu_id);
                $menu->decrement('stock', $cart->quantity);
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id' => $cart->menu_id,
                    'quantity' => $cart->quantity,
                    'price' => $menu->price,
                ]);

                $cart->delete();
            }
        }

        return Redirect::back()->with('message', 'Data berhasil di order!');
    }

    public function index(): Response {
        $user = Auth::user();
        $orders = Order::latest()->get();
        return Inertia::render('Orders/Index', ['orders' => $orders, 'user' => $user]);
    }

    public function show(Order $order): Response {
        $orderItems = OrderItem::with('menu', 'order')->where('order_id', $order->id)->get();
        return Inertia::render('Orders/Show', ['orderItems' => $orderItems, 'order' => $order]);
    }

    public function completed(Order $order, Request $request) {
        $validasi = $request->validate([
            'status' => 'required|string',
        ]);
        if($order->status == 'pending') {
            $order->update([
                'status' => $validasi['status'],
            ]);
        }

        return Redirect::back();
    }
}