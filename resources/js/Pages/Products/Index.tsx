import { Head, router, useForm } from "@inertiajs/react"
import Button from "@/Components/ui/Button/Button"
import { Link } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { filterIndex } from "./Create.constant";
import Input from "@/Components/ui/Input";

interface Menutype {
    id: number,
    name: string,
    description: string,
    stock: number,
    price: number,
    image_url: string | null,
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
    menu: Menutype;
    user_id: number;
    quantity: number;
}
interface IndexMenu {
    menus: Menutype[];
    kategori_aktif: string | null;
    user: UserType;
    carts: CartType[];
}

const Index = (props: IndexMenu) => {
    const { } = useForm;
    const { menus, kategori_aktif, user, carts = [] } = props;
    const handleFilter = (label: string) => {
        router.get(route('menus.index'), { Kategori: label }, {
            preserveState: true,
            preserveScroll: true,
        })
    }
    const handleIncrement = (type: 'increment' | 'decrement', id: number) => {
        if(type === 'increment') {
            router.post(route('carts.add', id), {
                quantity: 1,
            }, {
                preserveScroll: true
            })
        }else {
            router.post(route('carts.decrement', id), {
                quantity: 1,
            }, {
                preserveScroll: true,
            })
        }
    }

    const handleOrder = () => {
        if(confirm('Apakah anda ingin order?')) {
            router.post(route('orders.order'), {}, {
                preserveScroll: true,
            });
        }
    }
    const handleDelete = () => {
        if(confirm('Apakah ingin reset?')) {
            router.delete(route('carts.remove'), {preserveScroll: true})
        }
    }
    const totalAmount = carts.reduce((total, item) => {
        return total + (item.menu ? item.quantity * item.menu.price : 0);
    }, 0)
    return (
        // <AuthenticatedLayout>
            <main className="p-4 md:p-4 flex flex-col md:flex-row gap-[32px] bg-white">

                <Head title="Index" />
                <div className="md:w-[70%]">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl md:text-[36px] font-extrabold mb-3">Explore Our Best Menu</h1>
                        {/* <div className="flex gap-3">
                            <Link href={route('menus.create')}>
                                <Button color="primer">Tambah Produk</Button>
                            </Link>
                            <Link href={route('carts.index')}>
                                <Button color="sekunder" className="w-[150px]">Cart</Button>
                            </Link>
                            <Link href={route('orders.index')}>
                                <Button color="sekunder" className="w-[150px]">List Order</Button>
                            </Link>
                        </div> */}
                    </div>

                    <div className="flex gap-4 flex-wrap mb-7 mr-4 font-bold">
                        {filterIndex.map((item) => {
                            // Cek URL params untuk menentukan kategori yang aktif
                            const kategoriAktif = kategori_aktif || 'All';
                            const isSelected = kategoriAktif === item;

                            return (
                                <Button 
                                    key={item} 
                                    onClick={() => handleFilter(item)} 
                                    color={isSelected ? "primer" : "sekunder"}
                                    className="font-bold"
                                >
                                    {item}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-[20px] gap-5">
                        {menus.map((item) => (
                            <div className="p-4 shadow-[0px_0px_4px_rgba(0,0,0,0.2)] rounded-[24px]">
                                <img src={`${item.image_url}`} alt={item.name} className="w-[100%] h-[200px] object-cover rounded-[14px] mb-[10px]" />
                                <hr />
                                <p className="font-extrabold text-lg mt-2">{item.name}</p>
                                <div className="flex md:justify-between items-center justify-between">
                                    <p className="font-extrabold text-lg" >Rp {Number(item.price).toLocaleString('id-ID')}</p>
                                    <Link href={route('menus.detail', item.id)}>
                                        <Button color="primer" className="">Detail</Button>
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
                <div className="md:w-[30%]">
                    <div className="shadow-[0px_0px_4px_rgba(0,0,0,0.2)] flex flex-col p-5 sticky top-5 rounded-2xl h-fit">
                        <div className="flex items-center justify-between">
                            <h1 className="font-extrabold text-2xl">Customer Information</h1>
                            <Button color="sekunder" onClick={handleDelete}>Cancel</Button>
                        </div>
                        <div className="bg-[#ececec] p-5 rounded-3xl mt-5">
                            <h3 className="font-extrabold text-lg">Customer Name</h3>
                            <p className="border border-[#1c1c1c] px-3 py-4 rounded-xl mt-4 font-bold bg-white">{user.name}</p>
                        </div>
                        <div className="mt-4">
                            <h2 className="font-extrabold text-2xl">Customer Order</h2>
                        </div>
                        <div className="bg-[#ececec] p-5 mt-3 rounded-2xl mb-4 flex flex-col">
                            {carts.length === 0 ? (
                                <h3 className="text-center font-bold text-lg">Cart is empty</h3>
                            ): (
                                <div className="flex flex-col">
                                    {carts.map((item) => (
                                        <div className="flex items-center justify-between">
                                            <p className="font-extrabold">{item.menu.name}</p>
                                            <div className="flex items-center gap-6 mb-2">
                                                <Button onClick={() => handleIncrement('decrement', item.menu_id)} className="w-8 h-8">-</Button>
                                                <p className="font-extrabold">{item.quantity}</p>
                                                <Button onClick={() => handleIncrement('increment', item.menu_id)} className="w-8 h-8">+</Button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-extrabold mt-7 border bg-[#fff] border-[#1c1c1c] px-3 py-3 rounded-2xl">
                                        <p>Total Bayar : </p>
                                        <p>Rp {Number(totalAmount).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            )}
                            
                        </div>
                        {carts.length >= 1 ? (
                            <div className="grid grid-cols-2 gap-4">
                                <Link href={route('carts.index')} classID="w-full">
                                    <Button color="sekunder" className="w-full">Cart</Button>
                                </Link>
                                <Button onClick={handleOrder}>Order</Button>
                                
                            </div>
                        ): ''} 
                    </div>
                </div>

            </main>
            // </AuthenticatedLayout>
    )
}

export default Index;