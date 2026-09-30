import { Head, router } from "@inertiajs/react";

interface MenuType {
    id: number;
    name: string;
    description: string;
    stock: number;
    price: number;
    image_url: string | null;
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
    menu: MenuType;
    user_id: number;
    quantity: number;
}

interface IndexType {
    carts: CartType[];
    user: UserType;
}

const Index = (props: IndexType) => {
    const { carts, user } = props;

    const handleUpdateQuantity = (type: string, id: number) => {
        if(type === 'increment') {
            router.post(route('carts.add', id), {
                quantity: 1,
            }, {
                preserveScroll: true,
            })
        } else {
            router.post(route('carts.decrement', id), {
                quantity: 1,
            }, {
                preserveScroll: true,
            })
        }
    }

    return (
        <main>
            <Head title="Cart" />
            <div>
                <h2>Keranjang Milik: {user.name}</h2>
                {carts.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        
                        {item.menu && (
                            <>
                                <div>
                                    <img src={`${item.menu.image_url}`} alt={item.menu.name} style={{ width: '100px', borderRadius: '8px' }} />
                                </div>
                                <div>
                                    <p><strong>Name:</strong> {item.menu.name}</p>
                                    <p><strong>Price:</strong> Rp {item.menu.price}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button 
                                            onClick={() => handleUpdateQuantity('decrement', item.menu_id)}
                                            style={{ padding: '5px 10px', cursor: 'pointer' }}
                                        >
                                            -
                                        </button>
                                        <p style={{ margin: 0 }}><strong>Quantity:</strong> {item.quantity}</p>
                                        <button 
                                            onClick={() => handleUpdateQuantity('increment', item.menu_id)}
                                            style={{ padding: '5px 10px', cursor: 'pointer' }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Index;