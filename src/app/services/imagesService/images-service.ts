import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from '../../interfaces/Image';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    private http = inject(HttpClient);

    private api = environment.apiUrl;

    constructor() {}

    obtenerImagenes(): Observable<Image[]> {
        return this.http.get<Image[]>(`${this.api}/images/all`);
    }

    obtenerImagenPorId(id: number): Observable<Image> {
        return this.http.get<Image>(`${this.api}/images/by_id/${id}`);
    }

    obtenerImagenesPorEvento(eventId: number): Observable<Image[]> {
        return this.http.get<Image[]>(`${this.api}/images/by_event/${eventId}`);
    }

    crearImagen(image: Image): Observable<Image> {
        return this.http.post<Image>(`${this.api}/images/create`, image);
    }

    actualizarImagen(id: number, image: Image): Observable<Image> {
        return this.http.put<Image>(`${this.api}/images/update/${id}`, image);
    }

    eliminarImagen(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/images/delete/${id}`);
    }
}
