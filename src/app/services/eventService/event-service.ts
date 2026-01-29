import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../interfaces/Event';
import { EventStadistics } from '../../interfaces/EventStadistics';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private http = inject(HttpClient);

    private api = environment.apiUrl;

    private currentEvent: Event | null = null;

    constructor() {}

    obtenerEventos(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.api}/events/all`);
    }

    obtenerEventoPorId(id: number): Observable<Event> {
        return this.http.get<Event>(`${this.api}/events/by_id/${id}`);
    }

    obtenerEventoPorTitulo(title: string): Observable<Event> {
        return this.http.get<Event>(`${this.api}/events/by_title/${title}`);
    }

    obtenerEventoPorFecha(date: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.api}/events/by_date/${date}`);
    }

    obtenerEventosProximasDosSemanas(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.api}/events/by_two_weeks`);
    }

    obtenerEstadisticasEventos(): Observable<EventStadistics[]> {
        return this.http.get<EventStadistics[]>(`${this.api}/events/stadistic`);
    }

    crearEvento(event: Event): Observable<Event> {
        return this.http.post<Event>(`${this.api}/events/create`, event);
    }

    actualizarEvento(id: number, event: Event): Observable<Event> {
        return this.http.put<Event>(`${this.api}/events/update/${id}`, event);
    }

    eliminarEvento(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/events/delete/${id}`);
    }

    setEventoActivo(event: Event) {
        this.currentEvent = event;
        console.log('Evento seleccionado en service:', event);
    }

    getEventoActual(): Event | null {
        return this.currentEvent;
    }

    clearEvento() {
        this.currentEvent = null;
    }
}
