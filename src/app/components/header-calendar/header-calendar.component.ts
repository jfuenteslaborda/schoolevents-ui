import { Component, OnInit } from '@angular/core';
import {IonHeader, IonIcon, IonToolbar} from "@ionic/angular/standalone";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";


@Component({
    selector: 'app-header-calendar',
    templateUrl: './header-calendar.component.html',
    styleUrls: ['./header-calendar.component.scss'],
    imports: [
        IonHeader,
        IonToolbar,
        IonIcon
    ],
    standalone: true
})
export class HeaderCalendarComponent  implements OnInit {

    activeRoute: string = '/calendar';

    constructor(private router: Router) {

        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event) => {
                this.activeRoute = event.urlAfterRedirects;
            });
    }

    navigateWithAnimation(route: string, event: any) {
        const icon = event.target;
        icon.classList.add('clicked');

        setTimeout(() => {
            icon.classList.remove('clicked');
            this.router.navigate([route]);
        }, 300);
    }

  ngOnInit() {}

}
