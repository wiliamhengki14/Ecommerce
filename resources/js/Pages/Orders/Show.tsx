import { Link } from "@inertiajs/react";
import Button from "@/Components/ui/Button/Button";
import {Head} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface IUser {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}
interface IOrder {
    id: number;
    user_id: number;
    user: IUser;
    order_number: string;
    total_amount: number;
    status: string;
    note: string;
}
interface MenuType {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
    image_url: string | null;
}
interface IItem {
    id: number;
    order_id: IOrder;
    order: IOrder;
    menu: MenuType;
    menu_id: number;
    quantity: number;
    price: number;
}

interface IndexType {
    orderItems: IItem[];
    order: IOrder;
    user: IUser;
}

const Show = (props: IndexType) => {
    const {orderItems, order, user} = props;
    return (
        <AuthenticatedLayout>
        <main className="p-4 md:p-8 min-h-screen bg-white">
            <Head title="Detail Order"/>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl md:text-[32px] font-bold text-slate-800">Detail Order</h1>
                    <Link href={route('orders.index')}>
                        <Button color="sekunder">Kembali</Button>
                    </Link>
                </div>

                <div className="flex flex-col">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white shadow-sm border border-slate-100 p-4 md:p-6 rounded-2xl">
                        <div className="flex flex-col gap-1 md:gap-2">
                            <p className="text-xs md:text-sm text-slate-500">Order ID #:</p>
                            <p className="font-bold text-slate-800">{order.id}</p>
                        </div>
                        <div className="flex flex-col gap-1 md:gap-2">
                            <p className="text-xs md:text-sm text-slate-500">Order Number:</p>
                            <p className="font-bold text-slate-800 truncate" title={order.order_number}>{order.order_number}</p>
                        </div>
                        <div className="flex flex-col gap-1 md:gap-2">
                            <p className="text-xs md:text-sm text-slate-500">Customer Name:</p>
                            <p className="font-bold text-slate-800 truncate" title={order.user.name}>{order.user.name}</p>
                        </div>
                        <div className="flex flex-col gap-1 md:gap-2">
                            <p className="text-xs md:text-sm text-slate-500">Total Harga:</p>
                            <p className="font-bold text-slate-800">Rp {Number(order.total_amount).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex flex-col gap-1 md:gap-2">
                            <p className="text-xs md:text-sm text-slate-500">Status:</p>
                            <p className="font-bold text-slate-800">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mt-8 mb-4 text-slate-800">Daftar Menu</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orderItems.map((item) => (
                            <div key={item.id} className="bg-white shadow-sm border border-slate-100 flex p-4 items-center gap-4 rounded-2xl transition hover:shadow-md">
                                <div className="w-20 md:w-24 h-20 md:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                                    {item.menu.image_url ? (
                                        <img src={item.menu.image_url} alt={item.menu.name} className="w-full h-full object-cover"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-bold text-base md:text-lg text-slate-800">{item.menu.name}</p>
                                    <p className="text-slate-500 text-sm mt-1">{`Rp ${Number(item.price).toLocaleString('id-ID')} x ${item.quantity} Pcs`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
        </AuthenticatedLayout>
    )
}

export default Show;