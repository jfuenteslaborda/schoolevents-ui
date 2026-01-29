import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {IonIcon} from "@ionic/angular/standalone";

@Component({
    selector: 'app-footer-menu',
    templateUrl: './footer-menu.component.html',
    styleUrls: ['./footer-menu.component.scss'],
    imports: [
        IonIcon
    ]
})
export class FooterMenuComponent {
    expanded = false;
    activeRoute: string = '/calendar';

    constructor(private router: Router) {

        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event) => {
                this.activeRoute = event.urlAfterRedirects;
            });
    }

    toggleMenu() {
        this.expanded = !this.expanded;
    }

    navigateWithAnimation(route: string, event: any) {
        const icon = event.target;
        icon.classList.add('clicked');

        setTimeout(() => {
            icon.classList.remove('clicked');
            this.router.navigate([route]);
        }, 300);
    }
}
