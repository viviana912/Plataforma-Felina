// import { Component, OnInit } from '@angular/core';
// import { UsuarioService, Usuario } from '../services/usuario';
//
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html', // o template: '...'
//   standalone: true
// })
// export class AppComponent implements OnInit {
//
//   constructor(private usuarioService: UsuarioService) {}
//
//   ngOnInit() {
//     const nuevoUsuario: Usuario = {
//       nombre: 'Viviana',
//       apellido: 'Salazar',
//       email: 'viviana@example.com',
//       passwordHash: 'miContraseña123',
//       telefono: '123456789'
//     };
//
//     this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
//       next: res => console.log('Usuario creado en BD:', res),
//       error: err => console.error('Error al conectar con Java:', err)
//     });
//   }
// }
