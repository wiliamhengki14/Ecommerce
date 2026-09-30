# Panduan Login dan CRUD pada Laravel + React + Inertia.js

Dokumen ini berisi penjelasan detail mengenai bagaimana proses autentikasi (login) bekerja pada arsitektur **Laravel + React + Inertia.js**, serta bagaimana konsep tersebut digunakan sebagai fondasi untuk membuat fitur CRUD.

## Alur Kerja Sistem Login

Secara garis besar, Inertia.js memungkinkan kita membuat aplikasi _Single Page Application_ (SPA) menggunakan React, tetapi tetap menggunakan sistem _routing_ dan _controller_ tradisional milik Laravel, tanpa perlu membangun REST API yang terpisah.

Berikut adalah penjelasan hulu ke hilir proses login:

### 1. Database & Model
* **Database (Migration):** Saat instalasi, Laravel membuat tabel `users` (di database) melalui file migrasi di `database/migrations/0001_01_01_000000_create_users_table.php`. Tabel ini menyimpan `name`, `email`, `password` (yang di-hash), dll.
* **Model (`app/Models/User.php`):** Model ini adalah representasi tabel `users` di dalam kode Laravel (PHP). Melalui model inilah Laravel berinteraksi dengan database (misal: mencari data pengguna berdasarkan email saat login).

### 2. Route (Alur Permintaan / URL)
Terkait autentikasi, rutenya ada di `routes/auth.php` (yang dipanggil dari `routes/web.php`):
```php
// Menampilkan halaman form login (GET request)
Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');

// Memproses data form login yang disubmit (POST request)
Route::post('login', [AuthenticatedSessionController::class, 'store']);
```

### 3. Controller (Logika Backend)
Controller untuk login berada di `app/Http/Controllers/Auth/AuthenticatedSessionController.php`.

**Fungsi `create()` (Menampilkan Halaman):**
```php
public function create(): Response
{
    // Merender komponen React alih-alih file .blade.php
    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
}
```

**Fungsi `store()` (Memproses Data Login):**
```php
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate(); // Mengecek email dan password
    $request->session()->regenerate(); // Mencegah session fixation attack
    return redirect()->intended(route('dashboard', absolute: false)); // Redirect jika sukses
}
```

### 4. Frontend: Pages & UI (React)
Di folder `resources/js/Pages/Auth/Login.jsx` (atau `.tsx`), terdapat komponen React yang menggunakan *hook* `useForm` dari Inertia:
```javascript
import { useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    // 1. Inisialisasi state form
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // 2. Fungsi saat form disubmit
    const submit = (e) => {
        e.preventDefault();
        // Mengirim request POST ke route '/login'
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <form onSubmit={submit}>
            {/* Input Email */}
            <input 
                value={data.email} 
                onChange={(e) => setData('email', e.target.value)} 
            />
            {/* Menampilkan pesan error */}
            <div>{errors.email}</div> 
            
            <button disabled={processing}>Log in</button>
        </form>
    );
}
```

### 5. Menghubungkan Laravel & React (Inertia.js)
1. **Saat Load Pertama:** Request ke `/login` dibalas HTML oleh Laravel. HTML ini memiliki elemen pembungkus (app) yang memuat nama komponen React dan props awal.
2. **Saat Submit Form:** `post(route('login'))` tidak me-reload halaman browser, melainkan mengirim request XHR/AJAX.
3. **Respons Cerdas Laravel:** Saat controller merespons dengan `redirect()`, Laravel tidak mengirim HTML ulang, melainkan JSON yang berisi instruksi komponen React mana yang harus dimuat selanjutnya.
4. **Update Frontend:** React langsung mengganti halaman komponen berdasarkan instruksi tersebut sehingga aplikasi terasa seperti SPA murni.

---

## Langkah-Langkah Membuat Fitur CRUD

Berdasarkan pola di atas, berikut adalah pola umum untuk menambahkan fitur CRUD baru:

> [!TIP]
> **Pola 4 Langkah Pembuatan Fitur**
> Setiap fitur CRUD pada Laravel + Inertia selalu melibatkan Database, Route, Controller, dan React Page.

### 1. Siapkan Database
Buat file model beserta file migration-nya:
```bash
php artisan make:model Produk -m
```
Isi struktur kolom pada file migration dan jalankan `php artisan migrate`.

### 2. Siapkan Route (`routes/web.php`)
Daftarkan route resource untuk model tersebut:
```php
Route::resource('produk', ProdukController::class);
```

### 3. Siapkan Controller
Buat controller (jika belum ada) `app/Http/Controllers/ProdukController.php`:
*   **Fungsi `index()`:** Ambil data (`Produk::all()`), lalu kembalikan view React menggunakan `return Inertia::render('Produk/Index', ['produk' => $data]);`.
*   **Fungsi `create()`:** Kembalikan halaman form `return Inertia::render('Produk/Create');`.
*   **Fungsi `store(Request $request)`:** Lakukan validasi, simpan data ke database, lalu redirect kembali menggunakan `return redirect()->route('produk.index');`.

### 4. Siapkan React Frontend
Buat komponen React di dalam folder `resources/js/Pages/Produk/`:
*   **`Index.jsx`:** Komponen ini akan menerima `props.produk` dari controller dan menampilkannya dalam bentuk tabel.
*   **`Create.jsx`:** Komponen form yang menggunakan hook `useForm` dari `@inertiajs/react` untuk mengumpulkan input pengguna dan men-submit data ke `route('produk.store')`.
