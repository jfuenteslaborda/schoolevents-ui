export interface User {
    id?: number;
    full_name: string;
    email: string;
    password: string;
    photo?: string;
    date: string;
    is_Admin: number;
}