import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../interfaces/Comment';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    private http = inject(HttpClient);
    private baseUrl = '/api/comments';

    constructor() {}

    obtenerComentarios(): Observable<Comment[]> {
        return this.http.get<Comment []>(`${this.baseUrl}/all`);
    }

    obtenerComentariosPorUsuario(userId: number): Observable<Comment []> {
        return this.http.get<Comment []>(`${this.baseUrl}/by_user/${userId}`);
    }

    obtenerComentariosPorEvento(eventId: number): Observable<Comment []> {
        return this.http.get<Comment []>(`${this.baseUrl}/by_event/${eventId}`);
    }

    obtenerComentarioPorId(id: number): Observable<Comment> {
        return this.http.get<Comment >(`${this.baseUrl}/by_id/${id}`);
    }

    crearComentario(comment: Comment ): Observable<Comment > {
        return this.http.post<Comment >(`${this.baseUrl}/create`, comment);
    }

    actualizarComentario(id: number, comment: Comment ): Observable<Comment > {
        return this.http.put<Comment >(`${this.baseUrl}/update/${id}`, comment);
    }

    eliminarComentario(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
    }
}
