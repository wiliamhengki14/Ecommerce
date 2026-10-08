import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {Link} from "@inertiajs/react";
import Button from "@/Components/ui/Button/Button";
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
    return (
         <AdminLayout title="Kelola Produk">
            <main className="p-10 flex flex-col gap-10">
                <Head title="Detail"/>
                <div className="flex justify-between items-center">
                    <h1 className="font-extrabold text-2xl">Detail Produk</h1>
                    <Link href={route('admin.menus.index')}>
                        <Button color="sekunder">Kembali</Button>
                    </Link>
                </div>
                <div className="grid grid-cols-2 p-6 bg-[#ececec] rounded-2xl gap-6">
                    <div className="p-4 bg-white rounded-md">
                        <img src={`${menu.image_url}`} alt={menu.name} className="rounded-lg object-cover h-full"/>
                    </div>
                    <div className="flex flex-col gap-5 justify-around">
                        <h1 className="font-extrabold text-4xl">{menu.name}</h1>
                        <h1 className="font-extrabold text-4xl text-indigo-600">Rp {Number(menu.price).toLocaleString('id-ID')}</h1>
                        <span className="p-3 bg-white w-[150px] text-center rounded-full">Tersedia: {menu.stock} Pcs</span>
                        <div className="py-4 px-3 bg-white rounded-lg flex flex-col gap-3">
                            <h3 className="text-slate-600">Deskripsi Produk:</h3>
                            <p className="font-bold">{menu.description}</p>
                        </div>
                        <div className="py-4 px-3 bg-white rounded-lg flex flex-col gap-3">
                            <h3 className="text-slate-600">Kategori:</h3>
                            <p className="font-bold">{menu.kategori}</p>
                        </div>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}

export default Detail;