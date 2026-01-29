import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../interfaces/Comment';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    private http = inject(HttpClient);
    private api = environment.apiUrl;

    constructor() {}

    obtenerComentarios(): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.api}/comments/all`);
    }

    obtenerComentariosPorUsuario(userId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.api}/comments/by_user/${userId}`);
    }

    obtenerComentariosPorEvento(eventId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.api}/comments/by_event/${eventId}`);
    }

    obtenerComentarioPorId(id: number): Observable<Comment> {
        return this.http.get<Comment>(`${this.api}/comments/by_id/${id}`);
    }

    crearComentario(comment: Comment): Observable<Comment> {
        return this.http.post<Comment>(`${this.api}/comments/create`, comment);
    }

    actualizarComentario(id: number, comment: Comment): Observable<Comment> {
        return this.http.put<Comment>(`${this.api}/comments/update/${id}`, comment);
    }

    eliminarComentario(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/comments/delete/${id}`);
    }
}
