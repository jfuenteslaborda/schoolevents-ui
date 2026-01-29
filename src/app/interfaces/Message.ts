import {User} from './User';

export interface Message {
    id?: number;
    content: string;
    send_date: string;
    user: Partial<User>;
}