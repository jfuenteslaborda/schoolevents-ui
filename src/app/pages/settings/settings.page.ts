import { Component, OnInit } from '@angular/core';
import {
    IonContent,
    IonAvatar,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonInput
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
    cameraOutline,
    eyeOutline,
    eyeOffOutline,
    saveOutline,
    swapHorizontalOutline,
    logOutOutline
} from 'ionicons/icons';
import { HeaderSettingsComponent } from "../../components/header-settings/header-settings.component";
import { FooterMenuComponent } from "../../components/footer-menu/footer-menu.component";
import { UserService } from "../../services/userService/user-service";
import { User } from "../../interfaces/User";
import { Router } from "@angular/router";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonAvatar,
        IonButton,
        IonIcon,
        IonList,
        IonItem,
        IonInput,
        FormsModule,
        HeaderSettingsComponent,
        FooterMenuComponent
    ]
})
export class SettingsPage implements OnInit {

    user: User | null = null;
    username: string = '';
    email: string = '';
    password: string = '';
    profileImage: string = 'assets/default-avatar.jpg';
    showPassword: boolean = false;

    constructor(private userService: UserService, private router: Router) {
        addIcons({
            cameraOutline,
            eyeOutline,
            eyeOffOutline,
            saveOutline,
            swapHorizontalOutline,
            logOutOutline
        });
    }

    ngOnInit() {
        this.loadUserData();

        this.userService.currentUser$.subscribe(user => {
            if (user) {
                this.user = user;
                this.username = user.full_name;
                this.email = user.email;
                this.password = user.password;
                this.profileImage = user.photo || 'assets/default-avatar.jpg';
            }
        });
    }

    loadUserData() {
        this.user = this.userService.getUsuarioActual();
        if (this.user) {
            this.username = this.user.full_name;
            this.email = this.user.email;
            this.password = this.user.password;
            this.profileImage = this.user.photo || 'assets/default-avatar.jpg';
        }
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    changeProfileImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (event: any) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.profileImage = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    onImageError(event: any) {
        event.target.src = 'assets/images/profile-placeholder.png';
    }

    saveChanges() {
        if (!this.user || !this.isFormValid()) return;

        const updatedUser: User = {
            ...this.user,
            full_name: this.username,
            email: this.email,
            password: this.password,
            photo: this.profileImage
        };

        this.userService.actualizarUsuario(this.user!.id!, updatedUser).subscribe({
            next: (resp) => {
                console.log('Usuario actualizado y sobrescrito:', resp);
            },
            error: (err) => console.error('Error al actualizar usuario:', err)
        });
    }

    logout() {
        this.userService.logout();
        console.log('Cerrando sesión');
        this.router.navigate(['/login']);
    }

    isFormValid(): boolean {
        return this.username.trim().length > 0 &&
            this.email.trim().length > 0 &&
            this.validateEmail(this.email);
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
