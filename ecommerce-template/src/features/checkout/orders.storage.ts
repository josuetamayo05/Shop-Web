import { readJson,writeJson } from "../../core/lib/storage";

export type Order= {
    id:string;
    createdAt: string;

    currency: string;
    taxRate: number;

    customer:{
        fullName:string;
        email: string;
        phone: string;
        address1: string;
        city: string;
        postalCode:string;
        country: string;
    };

    shipping: {id:string; name:string; price:number};
    payment: {id: string; name: string};

    items: Array<{
        productId: string;
        name: string;
        unitPrice: number;
        quantity: number;
        lineTotal: number;
    }>

    totals: {
        subtotal: number;
        shipping: number;
        tax: number;
        total:number;
    };
};

const ORDERS_KEY = "orders-v1";

export function getOrders(): Order[] {
    return readJson<Order[]>(ORDERS_KEY,[]);
}

export function saveOrder(order: Order){
    const orders = getOrders()
    writeJson(ORDERS_KEY, [order, ...orders]);
}

export function findOrderbyId(id: string): Order | undefined{
    return getOrders().find((o)=>o.id===id);
}

export  function newOrderId(){
    return `ord_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}
