import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { IonicModule } from '@ionic/angular';

registerLocaleData(localeEs);

@Component({
    selector: 'app-calendar-component',
    standalone: true,
    imports: [CommonModule, IonicModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {

    @Output() fechaConfirmadaEvent = new EventEmitter<string>();

    fechaConfirmada: string = '';
    fechaISO: string = '';

    onConfirm(event: any) {
        this.fechaISO = event.detail.value.split('T')[0];

        const fecha = new Date(this.fechaISO);
        this.fechaConfirmada = fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        this.fechaConfirmadaEvent.emit(this.fechaISO);
    }

    onCancel() {
        this.fechaConfirmada = '';
        this.fechaISO = '';
    }
}
