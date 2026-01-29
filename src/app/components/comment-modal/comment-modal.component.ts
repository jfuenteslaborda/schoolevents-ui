import { Component } from '@angular/core';
import { IonicModule, ModalController, IonButton, IonInput } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-comment-modal',
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule],
    templateUrl: './comment-modal.component.html',
    styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent {
    nuevoComentario: string = '';

    constructor(private modalCtrl: ModalController) {}

    cerrar() {
        this.modalCtrl.dismiss();
    }

    publicar() {
        if (this.nuevoComentario.trim()) {
            this.modalCtrl.dismiss(this.nuevoComentario.trim());
        }
    }
}
