import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from 'src/app/interfaces/Message'


@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private http = inject(HttpClient);

    constructor() {}

    obtenerMensajes(): Observable<Message[]> {
        return this.http.get<Message[]>(`/api/messages/all`);
    }

    obtenerMensajesPorId(id: number):Observable<Message>{
        return this.http.get<Message>(`/api/messages/by_id/${id}`);
    }

    obtenerMensajesPorUsuario(userId: number): Observable<Message[]> {
        return this.http.get<Message[]>(`/api/messages/${userId}`);
    }

    crearMensaje(message: Message): Observable<Message> {
        return this.http.post<Message>(`/api/messages/create`, message);
    }

    actualizarMensaje(id: number, message: Message): Observable<Message> {
        return this.http.put<Message>(`/api/messages/update/${id}`, message);
    }

    eliminarMensaje(id: number): Observable<void> {
        return this.http.delete<void>(`/api/messages/delete/${id}`);
    }
}
