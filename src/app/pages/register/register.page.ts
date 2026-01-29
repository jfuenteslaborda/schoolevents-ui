import { Component, OnInit } from '@angular/core'; // <--- Importar OnInit
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { IonContent, IonFooter } from "@ionic/angular/standalone";
import { Router } from "@angular/router";
import { UserService } from '../../services/userService/user-service';
import { User } from '../../interfaces/User';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonFooter, IonContent]
})
export class RegisterPage implements OnInit {

    registerForm: FormGroup;
    passwordStrength: number = 0;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService
    ) {
        this.registerForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            fechaNacimiento: ['', Validators.required],
            correo: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    // Método para suscribirse a los cambios del control de contraseña
    ngOnInit() {
        this.password?.valueChanges.subscribe(password => {
            this.passwordStrength = this.calculatePasswordStrength(password || '');
            console.log('Fuerza de la contra: ', this.passwordStrength);
        });
    }

    get nombre() { return this.registerForm.get('nombre'); }
    get fechaNacimiento() { return this.registerForm.get('fechaNacimiento'); }
    get correo() { return this.registerForm.get('correo'); }
    get password() { return this.registerForm.get('password'); }

    // Ya no se necesita onPasswordInput

    calculatePasswordStrength(password: string): number {
        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[\W]/.test(password)) strength += 25;
        return Math.min(strength, 100);
    }

    onSubmit() {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const { nombre, fechaNacimiento, correo, password } = this.registerForm.value;


        const fechaParts = fechaNacimiento.split('-');
        const fechaFormateada = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;

        const newUserPayload = {
            full_name: nombre,
            date: fechaFormateada,
            email: correo,
            password: password,
            is_Admin: 0
        };

        console.log('Payload a enviar al backend:', newUserPayload);

        this.userService.crearUsuario(newUserPayload).subscribe({
            next: (resp) => {
                console.log('Usuario registrado:', resp);
                this.router.navigate(['/login']);
            },
            error: (err) => console.error('Error al registrar usuario:', err)
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

    isFormValid(): boolean {
        return !!(this.nombre?.valid && this.fechaNacimiento?.valid && this.correo?.valid && this.password?.valid);
    }
}