import { Head, router } from "@inertiajs/react";
import {Link} from "@inertiajs/react";
import Button from "@/Components/ui/Button/Button";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface MenuType {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
    image_url: string | null;
}
interface IndexTypes {
    menu: MenuType;
}
const Detail = (props: IndexTypes) => {
    const {menu} = props;
    
    const handleDelete = (id: number, name: string) => {
        if(confirm(`Apakah anda ingin hapus ${name}?`)) {
            router.delete(route('menus.delete', id), {
                preserveScroll: true,
                onSuccess: () => {}
            })
        }
    }

    const handleCart = (id: number) => {
        router.post(route('carts.add', id), {
            quantity: 1,
        }, {
            preserveScroll:true,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Detail - ${menu.name}`} />
            <main className="p-8 max-w-6xl mx-auto min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-extrabold text-[32px] text-gray-800">Detail Produk</h1>
                    <Link href={route('menus.index')}>
                        <Button color="sekunder" className="shadow-sm hover:shadow-md transition">Kembali</Button>
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-8 bg-[#ececec] rounded-[24px] p-6 md:p-8 shadow-sm">
                    {/* Bagian Kiri: Gambar */}
                    <div className="w-full md:w-1/2 flex items-center justify-center bg-white rounded-[20px] p-4 shadow-sm">
                        <img 
                            src={`${menu.image_url}`} 
                            alt={menu.name} 
                            className="rounded-xl w-full max-h-[450px] object-cover hover:scale-[1.02] transition-transform duration-300"
                        />
                    </div>

                    {/* Bagian Kanan: Info & Action */}
                    <div className="w-full md:w-1/2 flex flex-col justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-2">{menu.name}</h2>
                                <p className="text-3xl font-extrabold text-blue-600 mb-3">
                                    Rp {Number(menu.price).toLocaleString('id-ID')}
                                </p>
                                <span className="inline-block bg-white px-4 py-1.5 rounded-full text-sm font-bold text-gray-700 shadow-sm">
                                    Tersedia: {menu.stock} Pcs
                                </span>
                            </div>
                            
                            <div className="bg-white p-5 rounded-[16px] shadow-sm mt-2">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Deskripsi Produk</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {menu.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-4">
                            <Button onClick={() => handleCart(menu.id)} color="primer" className="w-full py-3 text-lg font-bold shadow-md hover:shadow-lg transition">
                                Add To Cart
                            </Button>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href={route('menus.edit', menu.id)}>
                                    <Button color="sekunder" className="w-full py-3 hover:bg-gray-200 transition">Edit</Button>
                                </Link>
                                <Button onClick={() => handleDelete(menu.id, menu.name)} className="w-full py-3 !bg-red-500 hover:!bg-red-600 !text-white transition shadow-sm border-none">
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    )
}

export default Detail;