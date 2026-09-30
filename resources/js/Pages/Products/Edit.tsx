import { router, useForm } from "@inertiajs/react";
import { FormEvent, useRef } from "react";
import Button from "@/Components/ui/Button/Button";
import Input from "@/Components/ui/Input";
interface MenuType {
    id: number;
    name: string;
    price: number;
    stock: number
    image_url: string | null;
    description: string
}
interface PropTypes {
    _method: string;
    name: string;
    price: string|number;
    stock: string|number;
    description: string;
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
        <main>
            <div>
                <h1>Form Edit</h1>
                <form onSubmit={handleUpdate}>
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
                    <img src={`${menu.image_url}`} alt={menu.name} className="w-[50%] h-[50%]"/>
                    <Input 
                        type="file"
                        id="image"
                        label="Gambar"
                        name="image"
                        ref={RefInput}
                        error={errors.image}
                        onChange={(e) => {
                            if(e.target.files && e.target.files[0]) {
                                setData('image', e.target.files[0]);
                            }
                        }}
                    />
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Memproses..' : 'Update'}
                    </Button>
                </form>
            </div>
        </main>
    )
}

export default Edit;