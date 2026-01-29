import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { Event } from "../../interfaces/Event";
import { EventService } from "../../services/eventService/event-service";
import { UserService } from '../../services/userService/user-service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [IonicModule, CommonModule, ReactiveFormsModule],
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnChanges, OnDestroy {

    @Input() fechaSeleccionada: string = '';
    @Output() eventoSeleccionado = new EventEmitter<Event>();

    eventos: Event[] = [];
    loading = false;
    error = '';
    isAdmin: boolean = false;
    private userSubscription: Subscription | null = null;

    slides: { image: string; title: string; description: string }[] = [];
    currentIndex = 0;

    private eventoActual: Event | null = null;

    showEditModal: boolean = false;
    editEventForm: FormGroup;
    imagePreviewSrc: string | ArrayBuffer | null = null;
    editingEventId: number | null = null;

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
    }

    ngOnInit() {
        this.userSubscription = this.userService.currentUser$.subscribe(user => {
            this.isAdmin = !!user?.is_Admin;
        });

        this.cargarEventos();
    }

    ngOnDestroy() {
        this.userSubscription?.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['fechaSeleccionada']) {
            if (this.fechaSeleccionada) {
                this.cargarEventosPorFecha(this.fechaSeleccionada);
            } else {
                this.cargarEventos();
            }
        }
    }

    cargarEventos() {
        this.loading = true;
        this.slides = [];

        this.eventService.obtenerEventos().subscribe({
            next: events => this.actualizarSlides(events),
            error: err => {
                this.error = 'No se pudieron cargar los eventos';
                this.loading = false;
            }
        });
    }

    cargarEventosPorFecha(fecha: string) {
        this.loading = true;
        this.slides = [];

        this.eventService.obtenerEventoPorFecha(fecha).subscribe({
            next: events => this.actualizarSlides(events),
            error: err => {
                this.error = 'No se pudieron cargar los eventos';
                this.loading = false;
            }
        });
    }

    private actualizarSlides(events: Event[]) {
        this.eventos = events;
        this.slides = events.map(event => ({
            image: event.src || 'assets/default-event.jpg',
            title: event.title,
            description: event.description || ''
        }));
        this.loading = false;
        this.currentIndex = 0;

        if (events.length > 0) {
            this.eventoActual = events[0];
        } else {
            this.eventoActual = null;
        }
    }

    next() {
        if (!this.slides.length) return;
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.eventoActual = this.eventos[this.currentIndex];
    }

    prev() {
        if (!this.slides.length) return;
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.eventoActual = this.eventos[this.currentIndex];
    }

    goTo(index: number) {
        if (!this.slides.length) return;
        this.currentIndex = index;
        this.eventoActual = this.eventos[index];
    }

    goToPage() {
        if (!this.eventoActual) return;
        this.eventService.setEventoActivo(this.eventoActual);
        this.eventoSeleccionado.emit(this.eventoActual);
        this.router.navigate(['/event']);
    }

    editarEvento() {
        if (!this.eventoActual) return;

        this.editingEventId = this.eventoActual.id || null;
        this.imagePreviewSrc = this.eventoActual.src;

        const [day, month, year] = this.eventoActual.date.split('-');
        const formattedDate = `${year}-${month}-${day}`;

        this.editEventForm.setValue({
            id: this.eventoActual.id || null,
            title: this.eventoActual.title,
            date: formattedDate,
            description: this.eventoActual.description,
            capacity: this.eventoActual.capacity,
            price: this.eventoActual.price,
            need_payment: this.eventoActual.need_payment,
            src: this.eventoActual.src
        });

        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editEventForm.reset();
        this.imagePreviewSrc = null;
        this.editingEventId = null;

        this.cargarEventosPorFecha(this.fechaSeleccionada || '');
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
        if (!this.eventoActual || !this.eventoActual.id) return;

        if (confirm('¿Estás seguro de que quieres eliminar el evento: ' + this.eventoActual.title + '?')) {
            const eventId = this.eventoActual.id;

            this.eventService.eliminarEvento(eventId).subscribe({
                next: () => {
                    this.cargarEventosPorFecha(this.fechaSeleccionada || '');
                },
                error: (err) => {
                    alert('Hubo un error al intentar eliminar el evento.');
                }
            });
        }
    }
}