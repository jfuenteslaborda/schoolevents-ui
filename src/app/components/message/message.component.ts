import { Component, OnInit } from '@angular/core';
import {IonAvatar, IonButton, IonCard, IonItem, IonLabel, IonList, IonSpinner} from "@ionic/angular/standalone";
import { CommonModule } from "@angular/common";
import {ModalController} from "@ionic/angular";
import {MessageService} from "../../services/messageService/message-service";
import {MessageModalComponent} from "../message-modal/message-modal.component";
import {Message} from "../../interfaces/Message";

@Component({
    selector: 'app-message',
    standalone: true,
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    imports: [
        CommonModule,
        IonList,
        IonCard,
        IonItem,
        IonAvatar,
        IonLabel,
        IonSpinner,
        IonButton,
    ]
})

export class MessageComponent implements OnInit {

    mensajes: Message[] = [];
    loading = true;

    constructor(private modalCtrl: ModalController, private messageService: MessageService) { }

    ngOnInit() {
        this.cargarMensajes();
    }

    cargarMensajes() {
        this.loading = true;
        this.messageService.obtenerMensajes().subscribe({
            next: (data: Message[]) => {
                this.mensajes = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error cargando mensajes', err);
                this.loading = false;
            }
        });
    }

    async abrirModal() {
        const modal = await this.modalCtrl.create({
            component: MessageModalComponent,
        });

        modal.onDidDismiss().then((result) => {
            if (result.data) {
                this.cargarMensajes();
            }
        });

        await modal.present();
    }
}
