import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    IonContent,
    IonButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonToggle
} from '@ionic/angular/standalone';
import { HeaderCalendarComponent } from "../../components/header-calendar/header-calendar.component";
import { FooterMenuComponent } from "../../components/footer-menu/footer-menu.component";
import { CalendarComponent } from "../../components/calendar/calendar.component";
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { CarouselUnfilteredComponent } from "../../components/carousel-unfiltered/carousel-unfiltered.component";
import { UserService } from '../../services/userService/user-service';
import { EventService } from '../../services/eventService/event-service';
import { User } from '../../interfaces/User';
import { Event } from '../../interfaces/Event';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.page.html',
    styleUrls: ['./calendar.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonButton,
        IonContent,
        IonModal,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonItem,
        IonLabel,
        IonInput,
        IonTextarea,
        IonToggle,
        HeaderCalendarComponent,
        FooterMenuComponent,
        CalendarComponent,
        CarouselComponent,
        CarouselUnfilteredComponent
    ]
})
export class CalendarPage implements OnInit, OnDestroy {

    fechaSeleccionada: string = '';
    isAdmin: boolean = false;
    showEventModal: boolean = false;
    private userSub!: Subscription;

    eventForm: FormGroup;
    imagePreviewSrc: string | null = null;

    constructor(
        private userService: UserService,
        private eventService: EventService,
        private fb: FormBuilder
    ) {
        this.eventForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(5)]],
            date: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(250)]],
            capacity: [1, [Validators.required, Validators.min(1)]],
            need_payment: [false],
            price: [0],
            src: ['', Validators.required] // Base64 string
        });
    }

    ngOnInit() {
        this.userSub = this.userService.currentUser$.subscribe((user: User | null) => {
            this.isAdmin = !!user?.is_Admin;
        });

        const currentUser = this.userService.getUsuarioActual();
        if (currentUser) {
            this.isAdmin = !!currentUser.is_Admin;
        }
    }

    ngOnDestroy() {
        this.userSub?.unsubscribe();
    }

    onFechaSeleccionada(fecha: string) {
        this.fechaSeleccionada = fecha;
    }

    openEventModal() {
        this.showEventModal = true;
        if (this.fechaSeleccionada) {
            this.eventForm.patchValue({ date: this.fechaSeleccionada });
        }
    }

    closeEventModal() {
        this.showEventModal = false;
        this.eventForm.reset({
            capacity: 1,
            price: 0,
            need_payment: false
        });
        this.imagePreviewSrc = null;
    }

    handleImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (event: any) => {
            const file = event.target.files[0];
            if (!file) return;

            this.imagePreviewSrc = URL.createObjectURL(file);

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.eventForm.get('src')?.setValue(e.target.result);
            };
            reader.readAsDataURL(file);
        };

        input.click();
    }

    saveEvent() {
        if (this.eventForm.invalid) {
            this.eventForm.markAllAsTouched();
            return;
        }

        const formData = this.eventForm.value;
        const [year, month, day] = formData.date.split('-');

        const newEvent: Event = {
            title: formData.title,
            date: `${day}-${month}-${year}`,
            description: formData.description,
            capacity: Number(formData.capacity),
            price: Number(formData.price),
            need_payment: !!formData.need_payment,
            src: formData.src // Aquí ya es Base64
        };

        this.eventService.crearEvento(newEvent).subscribe({
            next: () => this.closeEventModal(),
            error: (err) => console.error('Error al crear evento:', err)
        });
    }
}
