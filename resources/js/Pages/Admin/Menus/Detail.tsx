import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {Link} from "@inertiajs/react";
import Button from "@/Components/ui/Button/Button";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/Alert";
import { useState,useEffect } from 'react';
import {usePage} from "@inertiajs/react";
import { CheckCircle2, AlertCircle } from "lucide-react";
interface IMenu {
    id: number;
    name: string;
    description: string;
    price: number;
    kategori: string;
    stock: number;
    image_url: string | null;
}

interface IndexProp {
    menu: IMenu;
}

const Detail = (props: IndexProp) => {
    const {menu} = props;
    const {flash} = usePage<any>().props;
        const [isVisible, setIsVisible] = useState(false);
        useEffect(() => {
                if (flash?.message || flash?.success || flash?.error) {
                    setIsVisible(true);
                    const timer = setTimeout(() => setIsVisible(false), 3000);
                    return () => clearTimeout(timer);
                }
            }, [flash]);
    return (
         <AdminLayout title="Kelola Produk">
            <main className="p-4 md:p-10 flex flex-col gap-6 md:gap-10">
                <Head title="Detail"/>
                <div className="fixed top-15 right-15 md:right-[30%] z-[100] flex flex-col gap-2 min-w-[300px] max-w-md transition-all duration-300 justify-center items-center">
                    {isVisible && flash?.message && (
                        <Alert variant="success" className="shadow-lg animate-in fade-in slide-in-from-top-5 items-center">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Berhasil!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="font-extrabold text-xl md:text-2xl">Detail Produk</h1>
                    <Link href={route('admin.menus.index')}>
                        <Button color="sekunder">Kembali</Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-6 bg-[#ececec] rounded-2xl gap-6">
                    <div className="p-4 bg-white rounded-md">
                        <img src={`${menu.image_url}`} alt={menu.name} className="rounded-lg object-cover w-full h-auto md:h-full"/>
                    </div>
                    <div className="flex flex-col gap-4 md:gap-5 justify-around">
                        <h1 className="font-extrabold text-2xl md:text-4xl">{menu.name}</h1>
                        <h1 className="font-extrabold text-2xl md:text-4xl text-indigo-600">Rp {Number(menu.price).toLocaleString('id-ID')}</h1>
                        <span className="p-2 md:p-3 bg-white w-auto md:w-[150px] inline-block text-center rounded-full self-start">Tersedia: {menu.stock} Pcs</span>
                        <div className="py-3 md:py-4 px-3 bg-white rounded-lg flex flex-col gap-2 md:gap-3">
                            <h3 className="text-slate-600 text-sm md:text-base">Deskripsi Produk:</h3>
                            <p className="font-bold text-sm md:text-base">{menu.description}</p>
                        </div>
                        <div className="py-3 md:py-4 px-3 bg-white rounded-lg flex flex-col gap-2 md:gap-3">
                            <h3 className="text-slate-600 text-sm md:text-base">Kategori:</h3>
                            <p className="font-bold text-sm md:text-base">{menu.kategori}</p>
                        </div>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}

export default Detail;