import { Component, OnInit } from '@angular/core';
import {HeaderCalendarComponent} from "../../components/header-calendar/header-calendar.component";
import {IonContent} from "@ionic/angular/standalone";
import {FooterMenuComponent} from "../../components/footer-menu/footer-menu.component";
import {CarouselImagesComponent} from "../../components/carousel-images/carousel-images.component";
import {EventDescriptionComponent} from "../../components/event-description/event-description.component";
import {CommentComponent} from "../../components/comment/comment.component";

@Component({
    selector: 'app-event',
    templateUrl: './event.page.html',
    styleUrls: ['./event.page.scss'],
    standalone: true,
    imports: [
        HeaderCalendarComponent,
        IonContent,
        FooterMenuComponent,
        CarouselImagesComponent,
        EventDescriptionComponent,
        CommentComponent
    ]
})
export class EventPage  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
