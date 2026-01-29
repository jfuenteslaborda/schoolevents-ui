import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle
} from "@ionic/angular/standalone";
import { EventService } from '../../services/eventService/event-service';
import { Event } from '../../interfaces/Event';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-event-description',
    standalone: true,
    imports: [
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
        IonButton
    ],
    templateUrl: './event-description.component.html',
    styleUrls: ['./event-description.component.scss'],
})
export class EventDescriptionComponent implements OnInit, OnDestroy {

    event: Event | null = null;
    private eventSub?: Subscription;

    constructor(
        private alertCtrl: AlertController,
        private eventService: EventService
    ) {}

    ngOnInit() {
        this.event = this.eventService.getEventoActual();
        console.log('Evento cargado en descripción:', this.event);
    }



    ngOnDestroy() {
        // Limpiamos la suscripción
        this.eventSub?.unsubscribe();
    }

    async suscribe() {
        if (!this.event) return;

        if (!this.event.need_payment) {
            const alert = await this.alertCtrl.create({
                header: 'Inscripción completa',
                message: 'Te has inscrito gratis al evento.',
                buttons: ['OK'],
            });
            await alert.present();
        } else {
            const alert = await this.alertCtrl.create({
                header: 'Pago requerido',
                message: 'Este evento requiere pago. Procede con el pago para inscribirte.',
                buttons: [
                    { text: 'Cancelar', role: 'cancel' },
                    { text: 'Pagar', handler: () => this.paymentProcedure() }
                ],
            });
            await alert.present();
        }
    }

    paymentProcedure() {
        console.log('Redirigiendo al pago...');
    }
}
