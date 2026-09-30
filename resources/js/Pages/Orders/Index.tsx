import { Head, router } from "@inertiajs/react";
import {Link} from "@inertiajs/react";
import Button from "@/Components/ui/Button/Button";
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
    user: IUser; 
}
const Index = (props: IndexTypes) => {
    const {orders, user} = props;

    const handleComplete = (id: number, status: string) => {
        if(confirm('Apakah sudah membayar?')) {
            router.put(route('orders.completed', id), {status: status}, {
                preserveScroll:true,
            });
        }
    }
    return (
        <main>
            <Head title="Order"/>
            <div>
                <h1>Pemilik Pesanan: {user.name}</h1>
                {orders.map((item) => (
                    <div key={item.id}>
                        <p>ID# {item.id}</p>
                        <p>{item.order_number}</p>
                        <p>{item.status}</p>
                        <p>Harga: Rp{Number(item.total_amount).toLocaleString('id-ID')}</p>
                        <Link href={route('orders.show', item.id)}>
                            <Button color="sekunder">Detail</Button>
                        </Link>
                        {item.status === 'pending' ? <Button onClick={() => handleComplete(item.id, 'completed')}>Update</Button> : ''}
                        <hr />
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Index;