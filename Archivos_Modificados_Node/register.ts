import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../app/core/services/auth.service'; // usamos el servicio

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  today: string = new Date().toISOString().split('T')[0];

  // Datos del formulario
  formValue = {
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    sede: 'principal'
  };

  constructor(private authService: AuthService, private router: Router) { }

  handleRegister() {  // Eliminamos el parámetro formValue ya que usamos this.formValue
    if (this.formValue.password !== this.formValue.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Verificar que todos los campos requeridos estén completos
    if (!this.formValue.nombre || !this.formValue.apellidos || !this.formValue.email ||
      !this.formValue.password || !this.formValue.fechaNacimiento || !this.formValue.telefono) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    // Formatear la fecha de nacimiento al formato YYYY-MM-DD
    const fechaNacimiento = new Date(this.formValue.fechaNacimiento);
    const fechaFormateada = fechaNacimiento.toISOString().split('T')[0];

    // Estructura adaptada a tu backend Node
    const payload = {
      nombre: this.formValue.nombre,
      apellidos: this.formValue.apellidos,
      email: this.formValue.email,
      password: this.formValue.password,
      rol: 'cliente',
      fechaNacimiento: fechaFormateada,  // Cambiado de fecha_nacimiento a fechaNacimiento para que coincida con el backend
      telefono: this.formValue.telefono,
      sede: this.formValue.sede
    };

    console.log(' Enviando datos al backend Node:', payload);

    this.authService.registro(payload).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend:', response);
        alert('✅ Registrado correctamente. Ahora puedes iniciar sesión.');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('❌ Error al registrar:', error);
        if (error.error && error.error.message) {
          // Si el backend devuelve un mensaje de error, mostrarlo
          alert(`Error: ${error.error.message}`);
        } else if (error.status === 409) {
          alert('⚠️ El correo ya está registrado.');
        } else if (error.status === 400) {
          alert('⚠️ Datos inválidos. Revisa los campos.');
        } else {
          alert('❌ Ocurrió un error al registrar. Por favor, inténtalo de nuevo más tarde.');
        }
      }
    });
  }
}