interface IOrder {
    id: number;
    user_id: number;
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
}

const Show = (props: IndexType) => {
    const {orderItems, order} = props;
    return (
        <main>
            <div>
                <p>{order.order_number}</p>
                <p>{order.status}</p>
                {orderItems.map((item) => (
                    <div key={item.id}>
                        <p>{item.menu.name}</p>
                        <p>{item.quantity}</p>
                        <p>{item.price}</p>
                    </div>
                ))}
                <div>Total : {order.total_amount}</div>
            </div>
        </main>
    )
}

export default Show;