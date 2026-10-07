import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button/Button';
import { ArrowLeft, User, Package, Calendar, FileText, CheckCircle } from 'lucide-react';

interface Menu {
    id: number;
    name: string;
    image_url: string | null;
}

interface OrderItem {
    id: number;
    menu: Menu;
    quantity: number;
    price: number;
}

interface UserData {
    name: string;
    email: string;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    notes: string;
    created_at: string;
    user: UserData;
}

export default function AdminOrderShow({ order, orderItems }: { order: Order; orderItems: OrderItem[] }) {
    
    const markAsCompleted = () => {
        router.put(route('orders.completed', order.id), { status: 'completed' }, { preserveScroll: true });
    };

    return (
        <AdminLayout title={`Detail Pesanan ${order.order_number}`}>
            <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
                
                <div className="flex items-center gap-4">
                    <Link href={route('admin.orders.index')}>
                        <Button color="sekunder" className="!p-2 h-10 w-10 !rounded-lg" title="Kembali">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pesanan #{order.order_number}</h1>
                        <p className="text-sm text-gray-500 mt-1">Detail pesanan dan informasi pelanggan.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <Package className="h-5 w-5 text-gray-400" /> Item Pesanan
                            </h2>
                            <div className="divide-y divide-gray-100">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.menu.name}</p>
                                            <p className="text-sm text-gray-500">Rp {Number(item.price).toLocaleString('id-ID')} x {item.quantity}</p>
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-gray-400" /> Catatan Pelanggan
                                </h2>
                                <p className="text-gray-700">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <User className="h-5 w-5 text-gray-400" /> Pelanggan
                            </h2>
                            <div className="flex flex-col gap-1">
                                <p className="font-medium text-gray-900">{order.user.name}</p>
                                <p className="text-sm text-gray-500">{order.user.email}</p>
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <Calendar className="h-5 w-5 text-gray-400" /> Info Pesanan
                            </h2>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                    }`}>
                                        {order.status === 'completed' ? 'Selesai' : order.status === 'pending' ? 'Menunggu' : order.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Tanggal Pesanan</p>
                                    <p className="text-sm text-gray-900 font-medium">
                                        {new Date(order.created_at).toLocaleString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {order.status === 'pending' && (
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <Button onClick={markAsCompleted} className="w-full flex items-center justify-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> Tandai Selesai
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
