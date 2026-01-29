import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from '../../interfaces/Image';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    private http = inject(HttpClient);

    constructor() {}

    obtenerImagenes(): Observable<Image[]> {
        return this.http.get<Image[]>(`/api/images/all`);
    }

    obtenerImagenPorId(id: number): Observable<Image> {
        return this.http.get<Image>(`/api/images/by_id/${id}`);
    }

    obtenerImagenesPorEvento(eventId: number): Observable<Image[]> {
        return this.http.get<Image[]>(`/api/images/by_event/${eventId}`);
    }

    crearImagen(image: Image): Observable<Image> {
        return this.http.post<Image>(`/api/images/create`, image);
    }

    actualizarImagen(id: number, image: Image): Observable<Image> {
        return this.http.put<Image>(`/api/images/update/${id}`, image);
    }

    eliminarImagen(id: number): Observable<void> {
        return this.http.delete<void>(`/api/images/delete/${id}`);
    }
}
