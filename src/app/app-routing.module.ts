import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StatisticComponent} from './components';
import {AuthGuard} from './guards/auth.guard';
import {AdminComponent} from './components';
import {ProfileFormComponent} from './components/admin/profile-form/profile-form.component';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {LoginComponent} from './components/navigation/login/login.component';
import {NotFoundComponent} from './ui-components/not-found/not-found.component';

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
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class AppRoutingModule {
}
