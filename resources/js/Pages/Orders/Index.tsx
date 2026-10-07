import { Head, router, usePage } from "@inertiajs/react";
import {Link} from "@inertiajs/react";
import Button from "@/Components/ui/Button/Button";
import CustomerNavbar2 from "@/Components/CustomerNavbar2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { useState } from "react";
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
interface IndexTypes {
    orders: IOrder[];
}
const Index = (props: IndexTypes) => {
    const {orders} = props;
    const user = usePage<any>().props.auth.user;
    const [isVisible, setVisible] = useState(false);
    const handleComplete = (id: number, status: string) => {
            router.put(route('orders.completed', id), {status: status}, {
                preserveScroll:true,
            });
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <CustomerNavbar2 />
            <main className="p-4 md:p-8 min-h-screen bg-white">
                <Head title="Order"/>
        
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                        <h1 className="text-2xl md:text-[32px] font-bold text-slate-800">List Order Milik: {user.name}</h1>
                        <Link href={route('menus.index')}>
                            <Button color="sekunder">Kembali</Button>
                        </Link>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 md:px-6 py-4 text-center whitespace-nowrap">No</th>
                                        <th className="px-4 md:px-6 py-4 whitespace-nowrap">Order Number</th>
                                        <th className="px-4 md:px-6 py-4 whitespace-nowrap">Price</th>
                                        <th className="px-4 md:px-6 py-4 whitespace-nowrap">Status</th>
                                        <th className="px-4 md:px-6 py-4 whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-4 md:px-6 py-4 text-center whitespace-nowrap">{index + 1}</td>
                                            <td className="px-4 md:px-6 py-4 font-medium text-slate-800 whitespace-nowrap">{item.order_number}</td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">Rp {Number(item.total_amount).toLocaleString('id-ID')}</td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <Link href={route('orders.show', item.id)}>
                                                        <Button className="!px-3 !py-1.5 text-xs">Detail</Button>
                                                    </Link>
                                                    {item.status === 'pending' && user.is_admin ? (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger render={<Button 
                                                            className="!px-3 !py-1.5 text-xs"
                                                            
                                                        >
                                                            Completed
                                                        </Button>} />
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                <AlertDialogTitle>Apakah sudah membayar?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Ini akan mengubah status pembayaran menjadi "Completed" yang artinya pembayaran telah di selesaikan?
                                                                </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleComplete(item.id, 'completed')}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    ) : null}
                                                </div>
                                                
                                            </td>
                                            
                                        </tr>
                                        
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                Belum ada order.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Index;