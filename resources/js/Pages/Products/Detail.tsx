import { Head, router } from "@inertiajs/react";
import {Link} from "@inertiajs/react";
import Button from "@/Components/ui/Button/Button";
import { FormEvent } from "react";
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
        <main className="p-8 h-full">
            <Head title="Detail"/>
            <div className="flex flex-col gap-7">
                <div className="flex justify-between">
                    <h1 className="font-bold text-[32px]">Detail Menu {menu.name}</h1>
                    <Link href={route('menus.index')}>
                        <Button color="sekunder">Kembali</Button>
                    </Link>
                </div>
                <div className="flex flex-col bg-[#ececec] rounded-2xl p-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col">
                            <p>Nama Produk:</p>
                            <p className="font-bold">{menu.name}</p>
                        </div>
                        <div className="flex flex-col">
                            <p>Deskripsi Produk:</p>
                            <p className="font-bold">{menu.description}</p>
                        </div>
                        <div className="flex flex-col">
                            <p>Harga Produk:</p>
                            <p className="font-bold">Rp {Number(menu.price).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex flex-col">
                            <p>Stok Produk:</p>
                            <p className="font-bold">{menu.stock} Pcx</p>
                        </div>
                        
                    </div>
                    
                </div>
                <div className="grid grid-cols-2 gap-5 h-full">
                    <div className="bg-[#ececec] px-10 py-5 rounded-2xl h-[50%]">
                        <img src={`${menu.image_url}`} alt={menu.name} className="rounded-xl w-full h-full"/>
                    </div>
                    <div className="bg-[#ececec] rounded-2xl h-[50%] px-10 py-2 flex items-center flex-col justify-center gap-7">
                        <div className="grid grid-cols-2 w-full gap-2">
                            <Link href={route('menus.edit', menu.id)}>
                                <Button color="sekunder" className="w-full">Edit</Button>
                            </Link>
                            <Button onClick={() => handleDelete(menu.id, menu.name)} className="w-full">Hapus</Button>
                            
                        </div>
                        <Button onClick={() => handleCart(menu.id)} className="w-full">Add To Cart</Button>

                    </div>
                </div>
                

                
            </div>
        </main>
    )
}

export default Detail;