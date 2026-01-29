import { Component, OnInit } from '@angular/core';
import {IonHeader, IonIcon, IonToolbar} from "@ionic/angular/standalone";

@Component({
    selector: 'app-header-settings',
    templateUrl: './header-settings.component.html',
    styleUrls: ['./header-settings.component.scss'],
    imports: [
        IonHeader,
        IonIcon,
        IonToolbar
    ]
})
export class HeaderSettingsComponent  implements OnInit {

  constructor() {

  }

  ngOnInit() {}

}
