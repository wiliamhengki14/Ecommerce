import { Head, useForm } from "@inertiajs/react"
import Input from "@/Components/ui/Input";
import Button from "@/Components/ui/Button/Button";
import { FormEvent, useRef } from "react";
import {Link} from "@inertiajs/react";
import AdminLayout from '@/Layouts/AdminLayout';
import Select from "@/Components/ui/Select";
import { filter } from "./Create.constant";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/Alert";
import { useState,useEffect } from 'react';
import {usePage} from "@inertiajs/react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface MenuProp {
    name: string,
    price: string | number,
    description: string,
    stock: number | string,
    kategori: string;
    image: File | null,
}
const Create = () => {
    const {data, setData, errors, processing, post, reset} = useForm<MenuProp>({
        name: "",
        price: "",
        description: "",
        stock: "",
        kategori: "",
        image: null,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post(route('menus.store'), {
            onSuccess: () => {
                reset();
                if(fileInputRef.current) fileInputRef.current.value = "";
            }
        });
    }
    const {flash} = usePage<any>().props;
            const [isVisible, setIsVisible] = useState(false);
            useEffect(() => {
                    if (flash?.message || flash?.success || flash?.error) {
                        setIsVisible(true);
                        const timer = setTimeout(() => setIsVisible(false), 3000);
                        return () => clearTimeout(timer);
                    }
                }, [flash]);

    return (
        <AdminLayout title="Tambah Produk">
            <div className="fixed top-15 right-15 md:right-[30%] z-[100] flex flex-col gap-2 min-w-[300px] max-w-md transition-all duration-300 justify-center items-center">
                    {isVisible && flash?.message && (
                        <Alert variant="success" className="shadow-lg animate-in fade-in slide-in-from-top-5 items-center">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Berhasil!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                </div>
            <div className="flex flex-col shadow-[0px_0px_4px_rgba(0,0,0,0.2)] p-5 rounded-2xl gap-2 w-full max-w-2xl mx-auto bg-white">
                <h1 className="text-center font-bold text-[24px]">Halaman Tambah Product</h1>
                <form onSubmit={handleSubmit} className="mt-3 p-3 flex flex-col gap-3">
                    <Input 
                        id="name" 
                        name="name" 
                        label="Nama Product" 
                        placeholder="Masukkan Nama"
                        value={data.name}
                        error={errors.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <Input 
                        id="price" 
                        name="price" 
                        label="Harga Product" 
                        placeholder="Masukkan Harga" 
                        type="number"
                        value={data.price}
                        error={errors.price}
                        onChange={(e) => setData('price', e.target.value)}
                        required
                    />
                    <Input 
                        id="description" 
                        name="description" 
                        label="Deskripsi Produk" 
                        placeholder="Masukkan Deskripsi Produk" 
                        type="text"
                        value={data.description}
                        error={errors.description}
                        onChange={(e) => setData('description', e.target.value)}
                        required
                    />
                    <Input 
                        id="stock" 
                        name="stock" 
                        label="Stok Produk" 
                        placeholder="Masukkan Stok Produk" 
                        type="number"
                        value={data.stock}
                        error={errors.stock}
                        onChange={(e) => setData('stock', e.target.value)}
                        required
                    />
                    <Select 
                        name="kategori"
                        label="kategori"
                        id="kategori"
                        option={filter}
                        value={data.kategori}
                        error={errors.kategori}
                        onChange={(e) => setData('kategori', e.target.value)}
                    >

                    </Select>
                    <Input 
                        id="image" 
                        ref={fileInputRef}
                        name="image" 
                        label="Gambar Produk" 
                        type="file"
                        required
                        error={errors.image}
                        onChange={(e) => {
                            if(e.target.files && e.target.files[0]) {
                                setData('image', e.target.files[0])
                            }
                        }}
                        className="file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#1c1c1c] file:text-white hover:file:bg-[#333333] cursor-pointer"
                    />
                    <Button type="submit" color="primer" className="w-full" disabled={processing}>{processing ? 'Memproses...' : 'Tambah'}</Button>
                </form>
                <div className="flex flex-col justify-center items-center">
                    <Link href={route('admin.menus.index')} className="text-center py-1 px-2 border border-[#1c1c1c] w-[100px] rounded-[14px]">Ke Menu</Link>
                </div>
                
            </div>
        </AdminLayout>
    )
}

export default Create;