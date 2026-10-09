<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    // menuju ke index
    public function index(Request $request): Response
    {
        $query = Menu::latest();
        $user = Auth::user();
        $carts = Cart::with(['menu'], ['user'])->where('user_id', $user->id)
            ->get();
        // Ambil query string 'Kategori' atau 'kategori'
        $kategori = $request->query('Kategori') ?? $request->query('kategori');
        $search = $request->query('search');

        if ($kategori && $kategori !== 'All') {
            $query->where('kategori', $kategori);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%');
            });
        }

        $menus = $query->get()->map(fn ($menu) => $this->formatMenu($menu));

        return Inertia::render('Products/Index', ['menus' => $menus, 'kategori_aktif' => $kategori, 'user' => $user, 'carts' => $carts]);
    }

    public function adminIndex(): Response
    {
        $menus = Menu::latest()->get()->map(fn ($menu) => $this->formatMenu($menu));

        return Inertia::render('Admin/Menus/Index', ['menus' => $menus]);
    }

    public function adminDetail(Menu $menu): Response
    {
        return Inertia::render('Admin/Menus/Detail', [
            'menu' => $this->formatMenu($menu),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $validasi = $request->validate([
            'name' => 'required',
            'price' => 'required',
            'description' => 'required',
            'stock' => 'required',
            'kategori' => 'required',
            'image' => 'required|image|mimes:png,jpg,jpeg|max:2048',
        ]);
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }
        Menu::create([
            'name' => $validasi['name'],
            'price' => $validasi['price'],
            'description' => $validasi['description'],
            'stock' => $validasi['stock'],
            'kategori' => $validasi['kategori'],
            'image' => $imagePath,
        ]);

        return Redirect::back()->with('message', 'Data Berhasil di tambahkan!');
    }

    public function detail(Menu $menu): Response
    {
        return Inertia::render('Products/Detail', [
            'menu' => $this->formatMenu($menu),
        ]);
    }

    public function edit(Menu $menu): Response
    {
        return Inertia::render('Products/Edit', [
            'menu' => $this->formatMenu($menu),
        ]);
    }

    public function update(Request $request, Menu $menu)
    {
        $validasi = $request->validate([
            'name' => 'required',
            'price' => 'required',
            'description' => 'required',
            'stock' => 'required',
            'kategori' => 'required',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ]);
        $imagePath = $menu->image;
        if ($request->hasFile('image')) {
            if ($menu->image && Storage::disk('public')->exists($menu->image)) {
                Storage::disk('public')->delete($menu->image);
            }
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $menu->update([
            'name' => $validasi['name'],
            'price' => $validasi['price'],
            'description' => $validasi['description'],
            'stock' => $validasi['stock'],
            'kategori' => $validasi['kategori'],
            'image' => $imagePath,
        ]);

        return Redirect::route('admin.menus.detail', $menu)->with('message', 'Data Berhasil di update');
    }

    public function delete(Menu $menu)
    {
        if (Auth::user()->is_admin) {
            if ($menu->image && Storage::disk('public')->exists($menu->image)) {
                Storage::disk('public')->delete($menu->image);
            }
            $menu->delete();

            return Redirect::route('admin.menus.index')->with('message', 'Data Berhasil di hapus');
        }
    }

    private function formatMenu(Menu $menu): array
    {
        return [
            'id' => $menu->id,
            'name' => $menu->name,
            'description' => $menu->description,
            'price' => $menu->price,
            'stock' => $menu->stock,
            'kategori' => $menu->kategori,
            'image_url' => $menu->image ? asset('storage/'.$menu->image) : null,
        ];
    }
}
