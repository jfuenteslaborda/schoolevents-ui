import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonFooter } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { UserService } from '../../services/userService/user-service';
import { User } from '../../interfaces/User';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonContent, IonFooter]
})
export class LoginPage {

    loginForm: FormGroup;
    loginError: string = '';
    userNotFound: boolean = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService
    ) {
        this.loginForm = this.fb.group({
            correo: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    get correo() {
        return this.loginForm.get('correo');
    }

    get password() {
        return this.loginForm.get('password');
    }

    onSubmit(event?: any) {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const { correo, password } = this.loginForm.value;

        // Obtener usuario por email
        this.userService.obtenerUsuarioPorEmail(correo).subscribe({
            next: (user: User) => {
                this.userNotFound = false; // Resetear error
                if (user && user.password === password) {
                    console.log('Login correcto:', user);

                    // Guardamos usuario logueado en el servicio (y localStorage)
                    this.userService.setUsuarioLogueado(user);

                    // Animación de botón y redirección
                    if (event) {
                        const icon = event.target;
                        icon.classList.add('clicked');
                        setTimeout(() => {
                            icon.classList.remove('clicked');
                            this.router.navigate(['/calendar']);
                        }, 300);
                    } else {
                        this.router.navigate(['/calendar']);
                    }

                } else {
                    this.loginError = 'Correo o contraseña incorrectos';
                }
            },
            error: (err) => {
                console.error('Error al autenticar:', err);
                if (err.status === 404) {
                    this.userNotFound = true;
                } else {
                    this.loginError = 'Correo o contraseña incorrectos';
                }
            }
        });
    }

}
