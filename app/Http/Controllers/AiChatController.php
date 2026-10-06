<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Menu;
use App\Models\OrderItem;
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

        $systemPrompt = "Anda adalah asisten AI dari restoran kami yang ramah dan informatif.
Data yang harus Anda ketahui saat ini:
- Nama Pelanggan: {$user?->name}
- Informasi Keranjang Pelanggan saat ini: {$cartDetails}
- Informasi Menu Terlaris (Favorit): {$favoriteMenu}

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

        return response()->json(['error' => 'Gemini API Error: '.$errorDetail], 500);
    }
}
