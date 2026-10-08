<?php

namespace App\Http\Controllers;

use App\Models\Cart;
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
    public function order()
    {
        $user_id = Auth::id();
        $carts = Cart::with('menu')->where('user_id', $user_id)->get();

        if ($carts->isEmpty()) {
            return Redirect::back()->with('error', 'Keranjang belanja Anda kosong.');
        }

        DB::transaction(function () use ($carts, $user_id) {
            // Validasi kecukupan stok sebelum pemrosesan
            foreach ($carts as $cart) {
                if (! $cart->menu || $cart->menu->stock < $cart->quantity) {
                    throw new \Exception("Stok untuk produk {$cart->menu?->name} tidak mencukupi.");
                }
            }

            $totalAmount = $carts->reduce(function ($total, $cart) {
                return $total + ($cart->menu ? $cart->menu->price * $cart->quantity : 0);
            }, 0);

            $order = Order::create([
                'user_id' => $user_id,
                'order_number' => 'ORD-'.strtoupper(Str::random(8)),
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'notes' => '',
            ]);

            foreach ($carts as $cart) {
                $cart->menu->decrement('stock', $cart->quantity);
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id' => $cart->menu_id,
                    'quantity' => $cart->quantity,
                    'price' => $cart->menu->price,
                ]);
                $cart->delete();
            }
        });

        return Redirect::back()->with('message', 'Data berhasil di order!');
    }

    public function index(): Response
    {
        $user = Auth::user();
        if ($user->is_admin) {
            $orders = Order::latest()->get();
        } else {
            $orders = Order::latest()->where('user_id', $user->id)->get();
        }

        return Inertia::render('Orders/Index', ['orders' => $orders, 'user' => $user]);
    }

    public function adminIndex(Request $request): Response
    {
        $search = $request->query('search');

        $orders = Order::with('user')
            ->when($search, function ($query, $search) {
                $query->where('order_number', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => ['search' => $search],
        ]);
    }

    public function adminShow(Order $order): Response
    {
        $order->load('user');
        $orderItems = OrderItem::with('menu')->where('order_id', $order->id)->get();

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'orderItems' => $orderItems,
        ]);
    }

    public function show(Order $order)
    {
        $user = Auth::user();
        if ($user->id !== $order->user_id && ! $user->is_admin) {
            return Redirect::route('orders.index');
        } else {
            $order->load('user');
            $orderItems = OrderItem::with('menu', 'order')->where('order_id', $order->id)->get();

            return Inertia::render('Orders/Show', ['orderItems' => $orderItems, 'order' => $order, 'user' => $user]);
        }

    }

    public function completed(Order $order, Request $request)
    {
        $is_admin = Auth::user()->is_admin;
        if ($is_admin) {
            $validasi = $request->validate([
                'status' => 'required|string',
            ]);
            if ($order->status == 'pending') {
                $order->update([
                    'status' => $validasi['status'],
                ]);
            }

            return Redirect::back();
        } else {
            abort(403, 'Unauthorized action.');
        }
    }
}
