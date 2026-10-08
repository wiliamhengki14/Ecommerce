import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button/Button';
import { Plus, Edit, Trash2, Search, Eye, Package } from 'lucide-react';
import Input from '@/Components/ui/Input';
import Modal from '@/Components/Modal';
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/Alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Menu {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    kategori: string;
    image_url: string | null;
}

export default function AdminMenuIndex({ menus }: { menus: Menu[] }) {
    const { flash } = usePage<any>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (flash?.message || flash?.success || flash?.error) {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const filteredMenus = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const confirmDelete = (menu: Menu) => {
        setMenuToDelete(menu);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (menuToDelete) {
            router.delete(route('menus.delete', menuToDelete.id), {
                preserveScroll: true,
                onSuccess: () => setShowDeleteModal(false)
            });
        }
    };

    return (
        <AdminLayout title="Kelola Produk">
            <div className="flex flex-col gap-6">

                {/* Floating Alerts */}
                <div className="fixed top-15 right-[30%] z-[100] flex flex-col gap-2 min-w-[300px] max-w-md transition-all duration-300 justify-center items-center">
                    {isVisible && flash?.message && (
                        <Alert variant="success" className="shadow-lg animate-in fade-in slide-in-from-top-5 items-center">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Berhasil!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Daftar Produk</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola semua menu dan produk Anda di sini.</p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="search"
                                name="search"
                                type="text"
                                placeholder="Cari produk..."
                                className="pl-9 bg-gray-50 border-transparent focus:bg-white focus:border-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link href={route('menus.create')}>
                            <Button className="flex items-center gap-2 whitespace-nowrap">
                                <Plus className="h-4 w-4" />
                                Tambah Produk
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/50 text-gray-900 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Produk</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Harga</th>
                                    <th className="px-6 py-4">Stok</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMenus.length > 0 ? (
                                    filteredMenus.map((menu) => (
                                        <tr key={menu.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                        {menu.image_url ? (
                                                            <img src={menu.image_url} alt={menu.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{menu.name}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{menu.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    {menu.kategori}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                Rp {Number(menu.price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${menu.stock > 10 ? 'bg-green-50 text-green-700' : menu.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                                                    {menu.stock} item
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={route('admin.menus.detail', menu.id)}>
                                                        <Button color="sekunder" className="!p-2 h-10 w-10 !rounded-lg" title="Detail">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('menus.edit', menu.id)}>
                                                        <Button color="sekunder" className="!p-2 h-10 w-10 !rounded-lg !text-blue-600 !border-blue-200 hover:!bg-blue-50" title="Edit">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        color="sekunder"
                                                        className="!p-2 h-10 w-10 !rounded-lg !text-red-600 !border-red-200 hover:!bg-red-50"
                                                        onClick={() => confirmDelete(menu)}
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <Package className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                                            <p className="font-medium text-gray-900">Tidak ada produk ditemukan</p>
                                            <p className="text-sm">Mungkin Anda perlu menambahkan produk baru.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-extrabold text-red-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> Hapus Produk
                    </h2>
                    <p className="mt-3 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus produk <span className="font-bold text-gray-900">{menuToDelete?.name}</span>?
                        Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button color="sekunder" onClick={() => setShowDeleteModal(false)}>
                            Batal
                        </Button>
                        <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
                            Ya, Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
