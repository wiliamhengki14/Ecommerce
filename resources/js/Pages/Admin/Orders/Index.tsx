import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button/Button';
import { Eye, Search, FileText } from 'lucide-react';
import Input from '@/Components/ui/Input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination"

interface User {
    id: number;
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
    user: User;
}

interface PaginationLinkType {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: Order[];
    links: PaginationLinkType[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

export default function AdminOrderIndex({ orders, filters }: { orders: PaginatedOrders, filters: { search?: string } }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const isFirstRender = React.useRef(true);

    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('admin.orders.index'),
                { search: searchTerm },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    // Removed client-side filtering

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">Selesai</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">Menunggu</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700">{status}</span>;
        }
    };

    return (
        <AdminLayout title="Daftar Pesanan">
            <div className="flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Daftar Pesanan</h1>
                        <p className="text-sm text-gray-500 mt-1">Pantau dan kelola semua pesanan pelanggan Anda.</p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                id="search"
                                name="search"
                                type="text" 
                                placeholder="Cari ID / Nama / Status..." 
                                className="pl-9 bg-gray-50 border-transparent focus:bg-white focus:border-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {orders.total > 0 && (
                    <div className="flex justify-end items-center">
                        <Pagination>
                            <PaginationContent>
                                {orders.links.map((link, index) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationPrevious 
                                                    href={link.url || '#'} 
                                                    className={!link.url ? 'pointer-events-none opacity-50' : ''} 
                                                />
                                            </PaginationItem>
                                        );
                                    }
                                    if (link.label.includes('Next')) {
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationNext 
                                                    href={link.url || '#'} 
                                                    className={!link.url ? 'pointer-events-none opacity-50' : ''} 
                                                />
                                            </PaginationItem>
                                        );
                                    }
                                    if (link.label === '...') {
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationLink 
                                                href={link.url || '#'} 
                                                isActive={link.active}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/50 text-gray-900 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">ID Pesanan</th>
                                    <th className="px-6 py-4">Pelanggan</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Total Harga</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.data.length > 0 ? (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {order.order_number}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{order.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{order.user?.email || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                Rp {Number(order.total_amount).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={route('admin.orders.show', order.id)}>
                                                        <Button color="sekunder" className="!p-2 h-10 w-10 !rounded-lg" title="Detail Pesanan">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <FileText className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                            <p className="font-medium text-gray-900">Tidak ada pesanan ditemukan</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
