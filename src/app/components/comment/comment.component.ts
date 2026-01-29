import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CommentModalComponent } from 'src/app/components/comment-modal/comment-modal.component';
import { CommentService } from '../../services/commentService/comment-service';
import { EventService } from '../../services/eventService/event-service';
import { Comment } from '../../interfaces/Comment';
import { UserService } from "../../services/userService/user-service";
import { Subscription } from "rxjs";
import { User } from "../../interfaces/User";
import { Event } from "../../interfaces/Event";

interface ComentarioUI {
    username: string;
    profilePic: string;
    comment: string;
}

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [IonicModule, CommonModule],
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnDestroy {

    comentariosUI: ComentarioUI[] = [];
    user: User | null = null;

    private userSub?: Subscription;

    constructor(
        private modalCtrl: ModalController,
        private commentService: CommentService,
        private eventService: EventService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.userSub = this.userService.currentUser$.subscribe(user => {
            this.user = user;
        });

        const evento = this.eventService.getEventoActual();
        if (evento) {
            this.cargarComentarios(evento.id!);
        }
    }

    ngOnDestroy() {
        this.userSub?.unsubscribe();
    }

    cargarComentarios(eventId: number) {
        this.commentService.obtenerComentariosPorEvento(eventId).subscribe({
            next: (comments: Comment[]) => {
                this.comentariosUI = comments.map(c => ({
                    username: c.user?.full_name || 'Usuario',
                    profilePic: c.user?.photo || 'assets/profile-placeholder.png',
                    comment: c.description
                }));
            },
            error: (err) => console.error('Error al cargar comentarios:', err)
        });
    }

    async abrirModal() {
        const modal = await this.modalCtrl.create({
            component: CommentModalComponent,
        });

        modal.onDidDismiss().then((result) => {
            if (result.data && this.user) {
                const evento = this.eventService.getEventoActual();
                if (!evento) return;

                const today = new Date();
                const day = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();

                const nuevoComentario: Comment = {
                    description: result.data,
                    date: `${day}-${month}-${year}`,
                    user: { id: this.user.id },
                    event: { id: evento.id }
                };



                this.commentService.crearComentario(nuevoComentario).subscribe({
                    next: (c: Comment) => {
                        this.comentariosUI.push({
                            username: c.user?.full_name || 'Tú',
                            profilePic: c.user?.photo || 'https://png.pngtree.com/png-vector/20250512/ourmid/pngtree-default-avatar-profile-icon-vector-png-image_16213769.png',
                            comment: c.description
                        });
                    },
                    error: (err) => console.error('Error al crear comentario:', err)
                });
            }
        });

        await modal.present();
    }

}
