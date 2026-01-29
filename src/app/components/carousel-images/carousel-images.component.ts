import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { ImageService } from "../../services/imagesService/images-service";
import { EventService } from "../../services/eventService/event-service";
import { Event } from "../../interfaces/Event";

@Component({
    selector: 'app-carousel-images',
    standalone: true,
    imports: [IonicModule, CommonModule],
    templateUrl: './carousel-images.component.html',
    styleUrls: ['./carousel-images.component.scss']
})
export class CarouselImagesComponent implements OnInit {

    slides: { image: string; title: string; description: string }[] = [];
    currentIndex = 0;

    constructor(
        private router: Router,
        private imageService: ImageService,
        private eventService: EventService
    ) {}

    ngOnInit() {
        const evento: Event | null = this.eventService.getEventoActual();
        if (evento) {
            this.loadImagesForEvent(evento.id!);
        }
    }

    loadImagesForEvent(eventId: number) {
        this.imageService.obtenerImagenesPorEvento(eventId).subscribe({
            next: images => {
                this.slides = images.map(image => ({
                    image: image.src,
                    title: image.description || 'Sin descripción',
                    description: image.description || 'Sin descripción'
                }));
            },
            error: err => console.error('Error al cargar las imágenes', err)
        });
    }

    next() {
        if (!this.slides.length) return;
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }

    prev() {
        if (!this.slides.length) return;
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }
}
