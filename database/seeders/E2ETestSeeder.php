<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class E2ETestSeeder extends Seeder
{
    /**
     * Run the database seeds for Playwright E2E tests.
     */
    public function run(): void
    {
        // 1. Reset transactional tables for isolation
        Cart::query()->delete();
        OrderItem::query()->delete();
        Order::query()->delete();
        Menu::where('name', 'like', '%Playwright%')->delete();

        // 2. Ensure Customer user exists
        $customer = User::updateOrCreate(
            ['email' => 'customer@e2e.test'],
            [
                'name' => 'Customer E2E',
                'password' => Hash::make('password123'),
                'is_admin' => false,
                'email_verified_at' => now(),
            ]
        );

        // 3. Ensure Admin user exists
        $admin = User::updateOrCreate(
            ['email' => 'admin@e2e.test'],
            [
                'name' => 'Admin E2E',
                'password' => Hash::make('password123'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        // 4. Ensure predictable Menus exist
        Menu::updateOrCreate(
            ['name' => 'Espresso E2E'],
            [
                'description' => 'Espresso murni dengan aroma pekat dan crema tebal',
                'price' => 20000,
                'stock' => 20,
                'kategori' => 'Coffee',
                'image' => 'products/e2e-sample.jpg',
            ]
        );

        Menu::updateOrCreate(
            ['name' => 'Croissant Butter E2E'],
            [
                'description' => 'Pastry renyah dengan butter Perancis gurih',
                'price' => 25000,
                'stock' => 10,
                'kategori' => 'Pastries',
                'image' => 'products/e2e-sample.jpg',
            ]
        );

        Menu::updateOrCreate(
            ['name' => 'Matcha Latte E2E'],
            [
                'description' => 'Matcha asli dari Uji Jepang dengan susu segar',
                'price' => 28000,
                'stock' => 5,
                'kategori' => 'Non-Coffee',
                'image' => 'products/e2e-sample.jpg',
            ]
        );

        $outOfStock = Menu::updateOrCreate(
            ['name' => 'Out of Stock Coffee'],
            [
                'description' => 'Menu kopi yang persediaannya telah habis untuk test validasi stok',
                'price' => 30000,
                'stock' => 0,
                'kategori' => 'Coffee',
                'image' => 'products/e2e-sample.jpg',
            ]
        );

        // 5. Create a deterministic Pending Order for Customer E2E
        $espresso = Menu::where('name', 'Espresso E2E')->first();
        if ($espresso && $customer) {
            $order = Order::create([
                'user_id' => $customer->id,
                'order_number' => 'ORD-TEST1234',
                'total_amount' => 20000,
                'status' => 'pending',
                'notes' => 'Catatan pesanan test E2E',
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'menu_id' => $espresso->id,
                'quantity' => 1,
                'price' => 20000,
            ]);
        }
    }
}
