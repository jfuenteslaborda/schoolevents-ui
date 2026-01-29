import { User } from './User';
import { Event } from './Event';

export interface Comment {
    id?: number;
    description: string;
    date: string;
    user: Partial<User>;
    event: Partial<Event>;
}
