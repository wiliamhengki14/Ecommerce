import { router, useForm } from "@inertiajs/react";
import { FormEvent, useRef } from "react";
import Button from "@/Components/ui/Button/Button";
import Input from "@/Components/ui/Input";
import {Link} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from "@inertiajs/react";
import Select from "@/Components/ui/Select";
import { filter } from "./Create.constant";

interface MenuType {
    id: number;
    name: string;
    price: number;
    stock: number
    image_url: string | null;
    description: string;
    kategori: string;
}
interface PropTypes {
    _method: string;
    name: string;
    price: string|number;
    stock: string|number;
    description: string;
    kategori: string;
    image: File|null;
}
interface IndexMenu {
    menu: MenuType;
}

const Edit = ({menu}: IndexMenu) => {
    const {data, setData, post, reset, processing, errors} = useForm<PropTypes>({
        _method: 'PUT',
        name: menu.name||"",
        price: menu.price||"",
        stock: menu.stock||"",
        description: menu.description||"",
        kategori: menu.kategori||"",
        image: null,
    })
    const RefInput = useRef<HTMLInputElement>(null);
    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        post(route('menus.update', menu.id), {
            onSuccess: () => {
                if(RefInput.current) RefInput.current.value = "";
            }
        })
    }
    return (
        <AuthenticatedLayout>
        <main className="p-5 flex flex-col items-center justify-center h-[100vh]">
            <Head title="Edit"/>
            <div className="shadow-[0px_0px_4px_rgba(0,0,0,0.2)] p-5 rounded-2xl w-[40%]">
                <h1 className="font-bold text-[32px] text-center">Form Edit</h1>
                <form onSubmit={handleUpdate} className="p-4 flex flex-col">
                    <Input
                        label="Name"
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        error={errors.name}
                    />
                    <Input
                        label="Price"
                        id="price"
                        name="price"
                        value={data.price}
                        type="number"
                        error={errors.price}
                        onChange={(e) => setData('price', e.target.value)}
                        required
                    />
                    <Input 
                        label="Description"
                        id="description"
                        name="description"
                        value={data.description}
                        error={errors.description}
                        required
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <Input 
                        label="Stock"
                        type="number"
                        id="stock"
                        name="stock"
                        value={data.stock}
                        error={errors.stock}
                        required
                        onChange={(e) => setData('stock', e.target.value)}
                    />
                    <Select name="kategori" id="kategori" option={filter}
                        label="Kategori Produk"
                        value={data.kategori}
                        onChange={(e) => setData('kategori', e.target.value)}
                        error={errors.kategori}
                        required
                        className="w-full px-4 py-2 border rounded-xl border-[#e5e5e5] bg-[#fdfdfd] placeholder:text-[#a3a3a3] text-[15px] focus:outline-none focus:ring-1 focus:ring-black"
                    ></Select>
                    <p className="font-bold text-[14px]">Gambar</p>
                    <div className="mt-1 mb-5 flex gap-4 items-center">
                        <img src={`${menu.image_url}`} alt={menu.name} className="w-[30%] h-[30%] rounded-xl"/>
                        <Input 
                            type="file"
                            id="image"
                            name="image"
                            ref={RefInput}
                            error={errors.image}
                            onChange={(e) => {
                                if(e.target.files && e.target.files[0]) {
                                    setData('image', e.target.files[0]);
                                }
                            }}
                            className="border border-none file:border-none file:rounded-xl file:p-2 file:bg-[#1c1c1c] file:text-[#fff] file:outline-none"
                        />
                    </div>
                    
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Memproses..' : 'Update'}
                    </Button>
                    <Link href={route('menus.detail', menu.id)} className="text-center mt-3 italic hover:underline">Kembali</Link>
                </form>
            </div>
        </main>
        </AuthenticatedLayout>
    )
}

export default Edit;