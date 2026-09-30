<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    // menuju ke index
    public function index(): Response {
        // query semua data berdasarkan data terbaru
        $menus = Menu::latest()->get()->map(function($menu) {
            return [
                'id' => $menu->id,
                'name' => $menu->name,
                'description' => $menu->description,
                'price' => $menu->price,
                'stock' => $menu->stock,
                'image_url' => $menu->image ? asset('storage/' . $menu->image) : null,
            ];
        });
        return Inertia::render('Products/Index', ['menus' => $menus]);
    }

    public function create(): Response {
        return Inertia::render('Products/Create');
    }
    public function store(Request $request) {
        $validasi = $request->validate([
            'name' => 'required',
            'price' => 'required',
            'description' => 'required',
            'stock' => 'required',
            'image' => 'required|image|mimes:png,jpg,jpeg|max:2048',
        ]);
        $imagePath = null;
        if($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }
        Menu::create([
            'name' => $validasi['name'],
            'price' => $validasi['price'],
            'description' => $validasi['description'],
            'stock' => $validasi['stock'],
            'image' => $imagePath,
        ]);

        return Redirect::back();
    }

    public function detail(Menu $menu): Response {
        return Inertia::render('Products/Detail', [
            'menu' => [
                'id' => $menu->id,
                'name' => $menu->name,
                'description' => $menu->description,
                'price' => $menu->price,
                'stock' => $menu->stock,
                'image_url' => $menu->image ? asset('storage/' . $menu->image) : null,
            ]
        ]);
    }

    public function edit(Menu $menu): Response {
        return Inertia::render('Products/Edit', [
            'menu' => [
                'id' => $menu->id,
                'price' => $menu->price,
                'name' => $menu->name,
                'description' => $menu->description,
                'stock' => $menu->stock,
                'image_url' => $menu->image ? asset('storage/' . $menu->image) : null,
            ]
        ]);
    }

    public function update(Request $request, Menu $menu) {
        $validasi = $request->validate([
            'name' => 'required',
            'price' => 'required',
            'description' => 'required',
            'stock' => 'required',
            'image' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ]);
        $imagePath = $menu->image;
        if($request->hasFile('image')) {
            if($menu->image && Storage::disk('public')->exists($menu->image)) {
                Storage::disk('public')->delete($menu->image);
            }
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $menu->update([
            'name' => $validasi['name'],
            'price' => $validasi['price'],
            'description' => $validasi['description'],
            'stock' => $validasi['stock'],
            'image' => $imagePath,
        ]);

        return Redirect::route('menus.detail', $menu)->with('message', 'Data Berhasil di update');
    }

    public function delete(Menu $menu) {
        if($menu->image && Storage::disk('public') ->exists($menu->image)) {
            Storage::disk('public')->delete($menu->image);
        };
        $menu->delete();
        return Redirect::route('menus.index')->with('message', 'Data Berhasil di hapus');
    }
}
