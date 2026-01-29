import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { Event } from "../../interfaces/Event";
import { EventService } from "../../services/eventService/event-service";
import { UserService } from '../../services/userService/user-service';
import { Subscription, Observable, tap, switchMap, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-carousel-unfiltered',
    standalone: true,
    imports: [IonicModule, CommonModule, ReactiveFormsModule],
    templateUrl: './carousel-unfiltered.component.html',
    styleUrls: ['./carousel-unfiltered.component.scss']
})
export class CarouselUnfilteredComponent implements OnInit, OnDestroy {

    eventos$: Observable<Event[]>;
    private refreshEvents$ = new BehaviorSubject<void>(undefined);


    currentIndex = 0;
    loading = false;
    error = '';

    isAdmin: boolean = false;
    private userSubscription: Subscription | null = null;
    showEditModal: boolean = false;
    editEventForm: FormGroup;
    imagePreviewSrc: string | ArrayBuffer | null = null;
    editingEventId: number | null = null;

    eventosData: Event[] = [];

    constructor(
        private router: Router,
        private eventService: EventService,
        private userService: UserService,
        private fb: FormBuilder
    ) {
        this.editEventForm = this.fb.group({
            id: [null],
            title: ['', [Validators.required, Validators.minLength(5)]],
            date: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(250)]],
            capacity: [1, [Validators.required, Validators.min(1)]],
            price: [0, [Validators.required, Validators.min(0)]],
            need_payment: [false, Validators.required],
            src: ['', Validators.required]
        });

        this.eventos$ = this.refreshEvents$.pipe(
            tap(() => this.loading = true),
            switchMap(() => this.eventService.obtenerEventosProximasDosSemanas()),
            tap({
                next: (events) => {
                    this.eventosData = events;
                    this.loading = false;
                    this.currentIndex = 0;
                    this.error = '';
                },
                error: (err) => {
                    this.error = 'No se pudieron cargar los eventos';
                    this.loading = false;
                }
            })
        );
    }

    ngOnInit() {
        this.userSubscription = this.userService.currentUser$.subscribe(user => {
            this.isAdmin = !!user?.is_Admin;
        });
    }

    ngOnDestroy() {
        this.userSubscription?.unsubscribe();
        this.refreshEvents$.complete();
    }

    get slidesData(): { image: string; title: string; description: string; }[] {
        return this.eventosData.map(event => ({
            image: event.src || 'assets/default-event.jpg',
            title: event.title,
            description: event.description || ''
        }));
    }

    get eventoActual(): Event | null {
        return this.eventosData.length > 0 ? this.eventosData[this.currentIndex] : null;
    }

    next() {
        if (!this.eventosData.length) return;
        this.currentIndex = (this.currentIndex + 1) % this.eventosData.length;
    }

    prev() {
        if (!this.eventosData.length) return;
        this.currentIndex = (this.currentIndex - 1 + this.eventosData.length) % this.eventosData.length;
    }

    goTo(index: number) {
        if (!this.eventosData.length) return;
        this.currentIndex = index;
    }

    goToPage() {
        if (!this.eventoActual) return;
        this.eventService.setEventoActivo(this.eventoActual);
        this.router.navigate(['/event']);
    }

    editarEvento() {
        const evento = this.eventoActual;
        if (!evento) return;

        this.editingEventId = evento.id || null;
        this.imagePreviewSrc = evento.src;

        const [day, month, year] = evento.date.split('-');
        const formattedDate = `${year}-${month}-${day}`;

        this.editEventForm.setValue({
            id: evento.id || null,
            title: evento.title,
            date: formattedDate,
            description: evento.description,
            capacity: evento.capacity,
            price: evento.price,
            need_payment: evento.need_payment,
            src: evento.src
        });

        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editEventForm.reset();
        this.imagePreviewSrc = null;
        this.editingEventId = null;
        this.refreshEvents$.next();
    }

    handleImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (event: any) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const base64String = e.target.result;
                    this.imagePreviewSrc = base64String;
                    this.editEventForm.get('src')?.setValue(base64String);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    saveEditEvent() {
        if (this.editEventForm.invalid || !this.editingEventId) {
            this.editEventForm.markAllAsTouched();
            return;
        }

        const formData = this.editEventForm.value;

        const [year, month, day] = formData.date.split('-');
        const formattedDate = `${day}-${month}-${year}`;

        const updatedEvent: Event = {
            id: this.editingEventId,
            title: formData.title,
            date: formattedDate,
            description: formData.description,
            capacity: +formData.capacity,
            price: +formData.price,
            need_payment: formData.need_payment === true || formData.need_payment === 'true',
            src: formData.src
        } as Event;

        this.eventService.actualizarEvento(this.editingEventId, updatedEvent).subscribe({
            next: (response) => {
                this.closeEditModal();
            },
            error: (err) => {
                alert('Error al actualizar el evento.');
            }
        });
    }


    eliminarEvento() {
        const evento = this.eventoActual;
        if (!evento || !evento.id) return;

        if (confirm('¿Estás seguro de que quieres eliminar el evento: ' + evento.title + '?')) {
            const eventId = evento.id;

            this.eventService.eliminarEvento(eventId).subscribe({
                next: () => {
                    this.refreshEvents$.next();
                },
                error: (err) => {
                    alert('Hubo un error al intentar eliminar el evento.');
                }
            });
        }
    }
}