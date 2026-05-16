import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { GatosComponent } from './pages/gatos/gatos';
import { RegisterComponent} from './pages/register/register';
import {HomeComponent} from './pages/home/home';
import {ColaboraComponent} from './pages/colabora/colabora';
import {AdminPanelComponent} from './pages/admin-panel/admin-panel';
import {AdminUsuariosComponent} from './pages/admin/admin-usuarios/admin-usuarios';
import {AdminTareasComponent} from './pages/admin/admin-tareas/admin-tareas';
import {AdminFichasComponent} from './pages/admin/admin-fichas/admin-fichas';
import {AdminAdopcionesComponent} from './pages/admin/admin-adopciones/admin-adopciones';
import {PerfilComponent} from './pages/perfil/perfil';
import {ComoAyudar} from './pages/como-ayudar/como-ayudar';
import {GatoDetalleComponent} from './pages/gato-detalle/gato-detalle';
import {SolicitudAdopcionComponent} from './pages/solicitud-adopcion/solicitud-adopcion';
import {DonarComponent} from './pages/donar/donar';
import {ApadrinarComponent} from './pages/apadrinar/apadrinar';
import {adminGuard, authGuard} from './auth.guard';


export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'gatos', component: GatosComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'colabora', component: ColaboraComponent },
  {path: 'perfil', component: PerfilComponent},
  { path: 'como-ayudar', component: ComoAyudar},
  { path: 'gato/:id', component: GatoDetalleComponent},
  {
    path: 'adoptar/:gatoId',
    component: SolicitudAdopcionComponent,
    canActivate: [authGuard]
  },
  {
    path: 'acoger/:gatoId',
    component: SolicitudAdopcionComponent,
    canActivate: [authGuard]
  },
  { path: 'donar', component: DonarComponent },
  {
    path: 'apadrinar/:gatoId',
    component: ApadrinarComponent,
    canActivate: [authGuard]
  },

  {
    path: 'admin/panel',
    canActivate: [adminGuard],
    component: AdminPanelComponent,
    children: [
      { path: 'usuarios', component: AdminUsuariosComponent },
      { path: 'tareas', component: AdminTareasComponent },
      { path: 'fichas', component: AdminFichasComponent },
      { path: 'adopciones', component: AdminAdopcionesComponent },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
    ]
  },


  { path: '**', redirectTo: 'home' }
];
