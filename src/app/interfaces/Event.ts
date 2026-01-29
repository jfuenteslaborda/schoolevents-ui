 export interface Event {
    id?: number;
    title: string;
    description: string;
    price: number;
    capacity: number;
    date: string;
    src: string
    need_payment: boolean;
}