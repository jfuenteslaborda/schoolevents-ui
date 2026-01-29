import { Component, OnInit } from '@angular/core';
import {IonHeader, IonIcon, IonToolbar} from "@ionic/angular/standalone";

@Component({
    selector: 'app-header-messages',
    templateUrl: './header-messages.component.html',
    styleUrls: ['./header-messages.component.scss'],
    imports: [
        IonHeader,
        IonIcon,
        IonToolbar
    ]
})
export class HeaderMessagesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
