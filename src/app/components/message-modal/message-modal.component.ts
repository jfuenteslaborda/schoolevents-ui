import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { Message } from "../../interfaces/Message";
import { MessageService } from "../../services/messageService/message-service";
import { User } from "../../interfaces/User";
import { UserService } from "../../services/userService/user-service";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-message-modal',
    templateUrl: './message-modal.component.html',
    styleUrls: ['./message-modal.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule
    ]
})
export class MessageModalComponent implements OnInit {

    user: User | null = null;
    nuevoMensaje: string = '';
    private userSub?: Subscription;

    constructor(
        private modalCtrl: ModalController,
        private messageService: MessageService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.userSub = this.userService.currentUser$.subscribe(user => {
            this.user = user;
            if (!user) {
                console.log('No hay usuario logueado');
            } else {
                console.log('Usuario cargado:', user.full_name);
            }
        });
    }

    ngOnDestroy() {
        this.userSub?.unsubscribe();
    }

    cerrar() {
        this.modalCtrl.dismiss();
    }

    publicar() {
        if (!this.user) {
            console.error('No hay usuario logueado, no se puede publicar');
            return;
        }

        if (this.nuevoMensaje.trim()) {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();

            const messageDTO: Message = {
                content: this.nuevoMensaje.trim(),
                send_date: `${day}-${month}-${year}`,
                user: { id: this.user.id }
            };

            this.messageService.crearMensaje(messageDTO).subscribe({
                next: (res) => this.modalCtrl.dismiss(res),
                error: (err) => console.error('Error al publicar mensaje', err)
            });
        }
    }
}
