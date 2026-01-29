import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from 'src/app/interfaces/Message';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private http = inject(HttpClient);

    private api = environment.apiUrl;

    constructor() {}

    obtenerMensajes(): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.api}/messages/all`);
    }

    obtenerMensajesPorId(id: number): Observable<Message> {
        return this.http.get<Message>(`${this.api}/messages/by_id/${id}`);
    }

    obtenerMensajesPorUsuario(userId: number): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.api}/messages/${userId}`);
    }

    crearMensaje(message: Message): Observable<Message> {
        return this.http.post<Message>(`${this.api}/messages/create`, message);
    }

    actualizarMensaje(id: number, message: Message): Observable<Message> {
        return this.http.put<Message>(`${this.api}/messages/update/${id}`, message);
    }

    eliminarMensaje(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/messages/delete/${id}`);
    }
}
