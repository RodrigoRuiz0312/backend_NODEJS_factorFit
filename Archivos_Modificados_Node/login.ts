import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.html',
})
export class Login {
    loginError = signal('');
    isLoading = signal(false);
    credentials = {
        email: '',
        password: ''
    };

    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    handleLogin() {
        console.log('Iniciando proceso de login...');
        console.log('Credenciales recibidas:', { 
            email: this.credentials.email, 
            password: this.credentials.password ? '••••••••' : 'no proporcionada' 
        });

        if (!this.credentials.email || !this.credentials.password) {
            const errorMsg = 'Error: Correo o contraseña no proporcionados';
            console.warn(errorMsg);
            this.loginError.set('Por favor ingresa tu correo y contraseña');
            return;
        }

        this.isLoading.set(true);
        this.loginError.set('');
        console.log('Enviando solicitud de login al servidor...');

        this.authService.login(this.credentials).subscribe({
            next: (response: any) => {
                console.log('Respuesta del servidor:', response);
                
                if (response.token) {
                    console.log('Token recibido, guardando...');
                    this.authService.guardarToken(response.token);
                    console.log('Redirigiendo a la página de inicio...');
                    this.router.navigate(['/home']);
                } else {
                    console.warn('El servidor no devolvió un token');
                    this.loginError.set('Error en la respuesta del servidor. Intenta de nuevo.');
                }
                
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error en la autenticación:', {
                    status: error.status,
                    message: error.message,
                    error: error.error
                });
                
                const errorMessage = error.error?.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.';
                console.error('Mensaje de error para el usuario:', errorMessage);
                
                this.loginError.set(errorMessage);
                this.isLoading.set(false);
            },
            complete: () => {
                console.log('Proceso de login completado');
            }
        });
    }
}