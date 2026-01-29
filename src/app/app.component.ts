import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {addIcons} from 'ionicons'
import {notificationsOutline, schoolOutline, personCircleOutline,
        calendarOutline, settingsOutline, footballOutline, tennisballOutline} from "ionicons/icons";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {

      addIcons({
          personCircleOutline,
          schoolOutline,
          notificationsOutline,
          calendarOutline,
          settingsOutline,
          footballOutline,
          tennisballOutline
      });
  }
}
