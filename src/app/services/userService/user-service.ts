import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../interfaces/User';
import { UserStadistics } from '../../interfaces/UserStadistics';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private http = inject(HttpClient);

    private api = environment.apiUrl;

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private currentUser: User | null = null;

    constructor() {}

    getUsuarioActual(): User | null {
        return this.currentUser;
    }

    setUsuarioLogueado(user: User) {
        this.currentUser = user;
        this.currentUserSubject.next(user);
    }

    obtenerUsuarios(): Observable<User[]> {
        return this.http.get<User[]>(`${this.api}/users/all`);
    }

    obtenerUsuarioPorId(id: number): Observable<User> {
        return this.http.get<User>(`${this.api}/users/by_id/${id}`);
    }

    obtenerUsuarioPorEmail(email: string): Observable<User> {
        return this.http.get<User>(`${this.api}/users/by_email/${email}`);
    }

    obtenerEstadisticasUsuarios(): Observable<UserStadistics> {
        return this.http.get<UserStadistics>(`${this.api}/users/stadistic`);
    }

    crearUsuario(user: User): Observable<User> {
        return this.http.post<User>(`${this.api}/users/create`, user);
    }

    actualizarUsuario(id: number, user: User): Observable<User> {
        return this.http.put<User>(`${this.api}/users/update/${id}`, user).pipe(
            tap((updated) => {
                this.setUsuarioLogueado(updated);
            })
        );
    }

    eliminarUsuario(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/users/delete/${id}`);
    }

    logout() {
        this.currentUser = null;
        this.currentUserSubject.next(null);
    }
}
