import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonButton, IonContent, IonFooter, IonIcon} from '@ionic/angular/standalone';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonIcon, IonButton, IonContent, IonFooter]
})
export class HomePage {

    activeRoute: string = '/home';

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event) => {
                this.activeRoute = event.urlAfterRedirects;
            });
    }

    navigateWithAnimation(route: string, event: any) {
        const icon = event.target as HTMLElement;


        icon.classList.add('clicked');


        this.router.navigate([route]);


        setTimeout(() => icon.classList.remove('clicked'), 1);
    }
}
