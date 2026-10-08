<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class AiChatController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
            'history' => 'array',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        if (! $apiKey) {
            return response()->json(['error' => 'Gemini API key is not configured in .env as GEMINI_API_KEY.'], 500);
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={$apiKey}";

        // --- MENGUMPULKAN KONTEKS DATA DARI DATABASE ---
        $user = Auth::user();

        // 1. Data Keranjang (Total Belanjaan)
        $carts = Cart::with('menu')->where('user_id', $user?->id)->get();
        $cartDetails = 'Keranjang kosong.';
        if ($carts->count() > 0) {
            $total = 0;
            $items = [];
            foreach ($carts as $cart) {
                if ($cart->menu) {
                    $subtotal = $cart->quantity * $cart->menu->price;
                    $total += $subtotal;
                    $items[] = "{$cart->quantity}x {$cart->menu->name} (Rp ".number_format($subtotal, 0, ',', '.').')';
                }
            }
            if (count($items) > 0) {
                $cartDetails = 'Isi keranjang: '.implode(', ', $items).'. Total Harga: Rp '.number_format($total, 0, ',', '.');
            }
        }

        // 2. Data Menu Favorit (Paling Banyak Dibeli)
        $favoriteMenu = 'Belum ada data pesanan.';
        $topItem = OrderItem::select('menu_id', DB::raw('SUM(quantity) as total_sales'))
            ->groupBy('menu_id')
            ->orderByDesc('total_sales')
            ->first();
        if ($topItem) {
            $menu = Menu::find($topItem->menu_id);
            if ($menu) {
                $favoriteMenu = "Menu paling favorit/paling banyak dibeli saat ini adalah: {$menu->name} dengan total penjualan {$topItem->total_sales} porsi.";
            }
        }

        // 3. Data Seluruh Menu (Untuk Pertanyaan Kesehatan/Kadar Gula)
        $allMenus = Menu::select('name', 'price', 'description')->get();
        $menuList = [];
        foreach ($allMenus as $m) {
            $menuList[] = "- {$m->name} (Rp ".number_format($m->price, 0, ',', '.')."): {$m->description}";
        }
        $menusContext = implode("\n", $menuList);

        $adminContext = '';
        if ($user && $user->is_admin) {
            $totalProducts = Menu::count();
            $totalCategories = Menu::distinct('kategori')->count('kategori');
            $todayOrders = Order::whereDate('created_at', Carbon::today())->count();
            $todayRevenue = Order::whereDate('created_at', Carbon::today())->where('status', 'completed')->sum('total_amount');
            $totalRevenue = Order::where('status', 'completed')->sum('total_amount');

            // Produk dengan stok menipis (<= 3)
            $lowStockProducts = Menu::where('stock', '<=', 3)->select('name', 'stock')->get();
            $lowStockDetails = 'Semua stok produk aman (di atas 3).';
            if ($lowStockProducts->count() > 0) {
                $lowItems = [];
                foreach ($lowStockProducts as $item) {
                    $lowItems[] = "{$item->name} (sisa {$item->stock})";
                }
                $lowStockDetails = implode(', ', $lowItems);
            }

            $adminContext = "\n\nINFORMASI BISNIS (KHUSUS ADMIN):\n";
            $adminContext .= "- Total Produk: {$totalProducts}\n";
            $adminContext .= "- Total Kategori: {$totalCategories}\n";
            $adminContext .= "- Transaksi Hari Ini: {$todayOrders}\n";
            $adminContext .= '- Pendapatan Hari Ini (Selesai): Rp '.number_format($todayRevenue, 0, ',', '.')."\n";
            $adminContext .= '- Total Pendapatan Keseluruhan (Selesai): Rp '.number_format($totalRevenue, 0, ',', '.')."\n";
            $adminContext .= "- Peringatan Stok Menipis: {$lowStockDetails}\n";
            $adminContext .= "\nTUGAS KHUSUS ADMIN:\n";
            $adminContext .= "Sebagai AI Asisten Admin, tugas Anda adalah membantu admin {$user->name} membuat keputusan bisnis yang lebih cerdas dan meningkatkan efisiensi operasional wiliamCafe. Analisis data penjualan, produk, dan pendapatan yang diberikan, lalu berikan rekomendasi, ringkasan, atau wawasan secara profesional namun tetap ramah.";
        }

        $systemPrompt = "Anda adalah asisten AI dari restoran kami (wiliamCafe) yang ramah dan informatif.
Data yang harus Anda ketahui saat ini:
- Nama Pengguna: {$user?->name}
- Informasi Keranjang Pelanggan saat ini: {$cartDetails}
- Informasi Menu Terlaris (Favorit): {$favoriteMenu}
{$adminContext}

Daftar Seluruh Menu Restoran:
{$menusContext}

Tugas Anda:
1. Jika pengguna bertanya tentang total belanjaan, keranjang, atau tagihan, jawab berdasarkan Informasi Keranjang di atas.
2. Jika pengguna bertanya tentang menu favorit/terlaris, beritahu mereka berdasarkan Informasi Menu Terlaris di atas.
3. Jika pengguna bertanya tentang kesehatan, kalori, atau kadar gula dari suatu makanan, Anda harus MENGIRA-NGIRA estimasi informasi gizinya berdasarkan nama menu dan deskripsinya, beritahu pengguna bahwa itu adalah estimasi umum (karena database kami tidak menyimpan angka pastinya).
4. Gunakan bahasa Indonesia yang santai, sopan, bersahabat, dan tidak terlalu kaku.

Penting: Jawab sesuai dengan instruksi di atas dan jangan pernah berbohong mengenai isi keranjang pengguna.";

        // --- MENYIAPKAN PAYLOAD UNTUK GEMINI ---
        $contents = [];
        if ($request->has('history') && is_array($request->history)) {
            foreach ($request->history as $msg) {
                $role = isset($msg['role']) && $msg['role'] === 'user' ? 'user' : 'model';
                $contents[] = [
                    'role' => $role,
                    'parts' => [['text' => $msg['text'] ?? '']],
                ];
            }
        }
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $request->prompt]],
        ];

        $payload = [
            'systemInstruction' => [
                'parts' => [
                    ['text' => $systemPrompt],
                ],
            ],
            'contents' => $contents,
        ];

        $response = Http::post($url, $payload);

        if ($response->successful()) {
            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

            return response()->json(['reply' => $text]);
        }

        $errorDetail = $response->json('error.message') ?? 'Unknown error from Gemini API';

        return response()->json(['error' => 'Layanan AI sedang mengalami gangguan. Silakan coba beberapa saat lagi.'], 500);
    }
}
