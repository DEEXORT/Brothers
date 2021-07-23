import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FooterComponent, HeaderComponent, NavigationComponent, StatisticComponent} from './components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminComponent } from './components';
import { DateFormComponent } from './components/custom/date-form/date-form.component';
import { PlayerFormComponent } from './components/admin/player-form/player-form.component';
import { GameFormComponent } from './components/admin/game-form/game-form.component';
import { ProtocolFormComponent } from './components/admin/protocol-form/protocol-form.component';
import { ProtocolFormPlayersComponent } from './components/admin/protocol-form/protocol-form-players/protocol-form-players.component';
import { ProfileFormComponent } from './components/admin/profile-form/profile-form.component';
import { SidebarNavigationComponent } from './components/navigation/sidebar-navigation/sidebar-navigation.component';
import { LoginComponent } from './components/navigation/login/login.component';
import { UserAccountComponent } from './components/navigation/user-account/user-account.component';
import { UiModalComponent } from './components/ui-components/ui-modal/ui-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    StatisticComponent,
    HeaderComponent,
    NavigationComponent,
    FooterComponent,
    AdminComponent,
    DateFormComponent,
    PlayerFormComponent,
    GameFormComponent,
    ProtocolFormComponent,
    ProtocolFormPlayersComponent,
    ProfileFormComponent,
    SidebarNavigationComponent,
    LoginComponent,
    UserAccountComponent,
    UiModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
