import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../interfaces/Event';
import { EventStadistics } from '../../interfaces/EventStadistics';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private http: HttpClient;

    private currentEvent: Event | null = null;
    private baseUrl = '/api/events';

    constructor(http: HttpClient) {
        this.http = http;
    }


    obtenerEventos(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.baseUrl}/all`);
    }

    obtenerEventoPorId(id: number): Observable<Event> {
        return this.http.get<Event>(`${this.baseUrl}/by_id/${id}`);
    }

    obtenerEventoPorTitulo(title: string): Observable<Event> {
        return this.http.get<Event>(`${this.baseUrl}/by_title/${title}`);
    }

    obtenerEventoPorFecha(date: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.baseUrl}/by_date/${date}`);
    }

    obtenerEventosProximasDosSemanas(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.baseUrl}/by_two_weeks`);
    }

    obtenerEstadisticasEventos(): Observable<EventStadistics[]> {
        return this.http.get<EventStadistics[]>(`${this.baseUrl}/stadistic`);
    }

    crearEvento(event: Event): Observable<Event> {
        return this.http.post<Event>(`${this.baseUrl}/create`, event);
    }

    actualizarEvento(id: number, event: Event): Observable<Event> {
        return this.http.put<Event>(`${this.baseUrl}/update/${id}`, event);
    }

    eliminarEvento(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
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
