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
        <main className="p-8">
            <Head title="Detail"/>
            <div className="flex flex-col gap-10">
                <h1>Detail Menu {menu.name}</h1>
                <div className="flex flex-col gap-3">
                    <p>{menu.name}</p>
                    <p>{menu.description}</p>
                    <p>{menu.price}</p>
                    <p>{menu.stock}</p>
                    <img src={`${menu.image_url}`} alt={menu.name} className="rounded-xl w-20 h-16"/>
                </div>

                <Link href={route('menus.edit', menu.id)}>
                    <Button color="sekunder">Edit</Button>
                </Link>
                <Button onClick={() => handleDelete(menu.id, menu.name)}>Hapus</Button>
                <Button onClick={() => handleCart(menu.id)}>Add To Cart</Button>
                <Link href={route('menus.index')}>
                    <Button color="sekunder">Kembali</Button>
                </Link>
            </div>
        </main>
    )
}

export default Detail;