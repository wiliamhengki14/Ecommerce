import { Head, useForm } from "@inertiajs/react"
import Button from "@/Components/ui/Button/Button"
import {Link} from "@inertiajs/react"
interface Menutype {
    id: number,
    name: string,
    description: string,
    stock: number,
    price: number,
    image_url: string | null,
}

interface IndexMenu {
    menus: Menutype[];
}

const Index = (props: IndexMenu) => {
    const {} = useForm;
    const {menus} = props;
    return (
        <main className="p-[20px] flex flex-col md:flex-row gap-[32px]">
            <Head title="Index"/>
            <div className="w-full">
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="text-[32px] font-bold">Explore Our Best Menu</h1>
                        <div className="flex gap-3">
                            <Link href={route('menus.create')}>
                                <Button color="primer">Tambah Produk</Button>
                            </Link>
                            <Link href={route('carts.index')}>
                                <Button color="sekunder" className="w-[150px]">Cart</Button>
                            </Link>
                        </div>
                    </div>
                
                    <div className="grid grid-cols-4 mt-[20px] gap-5">
                        {menus.map((item) => (
                            <div className="p-4 shadow-[0px_0px_4px_rgba(0,0,0,0.2)] rounded-lg">
                                <img src={`${item.image_url}`} alt={item.name} className="w-[100%] h-52 object-cover rounded-xl mb-2"/>
                                <hr />
                                <p className="font-bold text-base mt-2">{item.name}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <p className="font-bold" >Rp {Number(item.price).toLocaleString('id-ID')}</p>
                                    <Link href={route('menus.detail', item.id)}>
                                    <Button color="primer">Detail</Button></Link>
                                </div>
                                
                            </div>
                        ))}
                    </div>

            </div>
        </main>
    )
}

export default Index;