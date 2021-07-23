import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StatisticComponent} from './components';
import {AuthGuard} from './guards/auth.guard';
import {AdminComponent} from './components';
import {ProfileFormComponent} from './components/admin/profile-form/profile-form.component';

const routes: Routes = [
  {
    path: 'stats/:year',
    component: StatisticComponent
  },
  {
    path: 'profile/:id',
    component: ProfileFormComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  }
  // {
  //   path: '**',
  //   redirectTo: 'stats',
  //   pathMatch: 'full'
  // }
  // {
  //   path: 'admin',
  //   component: AdminComponent,
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
