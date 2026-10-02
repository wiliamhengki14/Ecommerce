import { Head, router } from "@inertiajs/react";
import Button from "@/Components/ui/Button/Button";
import {Link} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
interface MenuType {
    id: number;
    name: string;
    description: string;
    stock: number;
    price: number;
    image_url: string | null;
}

interface UserType {
    id: number;
    email: string;
    is_admin?: boolean;
    name: string;
}

interface CartType {
    id: number;
    menu_id: number;
    menu: MenuType;
    user_id: number;
    quantity: number;
}

interface IndexType {
    carts: CartType[];
    user: UserType;
}

const Index = (props: IndexType) => {
    const { carts = [], user } = props;

    const handleUpdateQuantity = (type: "increment" | "decrement", id: number) => {
        if(type === 'increment') {
            router.post(route('carts.add', id), {
                quantity: 1,
            }, {
                preserveScroll: true,
            })
        }else {
            router.post(route('carts.decrement', id), {
                quantity: 1,
            }, {
                preserveScroll:true,
            })
        }
    };
    const handleOrder = () => {
        if(confirm('Apakah anda ingin Order?')) {
            router.post(route('orders.order'), {}, {
                preserveScroll: true,
            });
        }
    }
    

    // Hitung total keseluruhan belanja
    const grandTotal = carts.reduce((total, item) => {
        return total + (item.menu? item.menu.price * item.quantity : 0);
    }, 0);

    return (
        <AuthenticatedLayout>
        <main className="p-4 md:p-8 min-h-screen bg-slate-50">
            <Head title="Cart" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 md:p-6 shadow-sm">
                {/* Header Halaman */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-6 border-b border-slate-100 mb-6 gap-4">
                    <h1 className="text-xl md:text-2xl font-bold text-[#1c1c1c]">Halaman Keranjang</h1>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full truncate max-w-[150px] sm:max-w-none">
                            {user?.name}
                        </span>
                        <Link href={route('menus.index')}>
                            <Button color="sekunder" className="h-[30px]">Kembali</Button>
                        </Link>
                    </div>
                </div>

                {/* Kondisi Jika Keranjang Kosong */}
                {carts.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                        Keranjang belanja Anda masih kosong.
                    </div>
                ) : (
                    <div>
                        {/* Header Kolom Grid */}
                        <div className="hidden md:grid md:grid-cols-3 pb-3 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <div>Produk</div>
                            <div className="text-center">Jumlah</div>
                            <div className="text-right">Subtotal</div>
                        </div>

                        {/* List Item Keranjang */}
                        <div className="divide-y divide-slate-100">
                            {carts.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col md:grid md:grid-cols-3 md:items-center py-4 gap-4"
                                >
                                    {/* Kolom 1: Foto, Nama & Harga Satuan */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                            {item.menu.image_url ? (
                                                <img
                                                    src={item.menu.image_url}
                                                    alt={item.menu.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-[#1c1c1c]">
                                                {item.menu.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Rp {Number(item.menu.price).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Kolom 2: Tombol Quantity (- / +) */}
                                    <div className="flex items-center justify-between md:justify-center gap-3">
                                        <span className="md:hidden text-sm font-semibold text-slate-500">Jumlah</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity("decrement", item.menu_id)}
                                                className="w-8 h-8 rounded-lg border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition flex items-center justify-center text-slate-700"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-sm text-slate-800 w-6 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity("increment", item.menu_id)}
                                                className="w-8 h-8 rounded-lg border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 transition flex items-center justify-center text-slate-700"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Kolom 3: Subtotal per Menu */}
                                    <div className="flex items-center justify-between md:block md:text-right">
                                        <span className="md:hidden text-sm font-semibold text-slate-500">Subtotal</span>
                                        <div className="font-bold text-sm text-[#1c1c1c]">
                                            Rp {(item.menu.price * item.quantity).toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Total Keseluruhan */}
                        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex justify-between w-full md:w-auto items-center">
                                <span className="font-bold text-base text-slate-700 md:mr-4">Total Pembayaran : </span>
                                <span className="font-extrabold text-xl md:text-2xl text-[#1c1c1c]">
                                    Rp {grandTotal.toLocaleString("id-ID")}
                                </span>
                            </div>
                            <Button className="w-full md:w-auto" onClick={handleOrder}>Order</Button>
                        </div>
                        
                    </div>
                )}
            </div>
        </main>
        </AuthenticatedLayout>
    );
};

export default Index;