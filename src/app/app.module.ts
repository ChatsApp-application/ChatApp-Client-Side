import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MychatsComponent } from './Routes/mychats/mychats.component';
import { ChatDetailsComponent } from './Routes/chat-details/chat-details.component';
import {FormsModule} from '@angular/forms';
import { UserFriendsComponent } from './Routes/user-friends/user-friends.component';
import { LoginComponent } from './Routes/login/login.component';
import { RegisterComponent } from './Routes/register/register.component';
import {AuthenticationService} from './Services/authentication.service';
import {ValidGuard} from './Services/Gaurd/valid.guard';
import {InvalidGuard} from './Services/Gaurd/invalid.guard';
import { NotfoundComponent } from './Routes/notfound/notfound.component';
import { HttpClientModule} from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {UserDetailsService} from './Services/user/user-details.service';
import {FreindsDetailsService} from './Services/friends/freinds-details.service';
import { FindPeopleComponent } from './Routes/find-people/find-people.component';
import { ProfileComponent } from './Routes/profile/profile.component';
import {ProfileService} from './Services/profile/profile.service';
import {SocketService} from './Services/socket-io/socket.service';
import { GroupsComponent } from './Routes/groups/groups.component';
import {GroupsService} from './Services/groups/groups.service';
import {Countries} from './models/countries';
import {NgxUsefulSwiperModule} from 'ngx-useful-swiper';

@NgModule({
  declarations: [
    AppComponent,
    MychatsComponent,
    ChatDetailsComponent,
    UserFriendsComponent,
    LoginComponent,
    RegisterComponent,
    NotfoundComponent,
    FindPeopleComponent,
    ProfileComponent,
    GroupsComponent
  ],
    imports: [
        BrowserModule,
        NgxUsefulSwiperModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
  providers: [AuthenticationService, ValidGuard, InvalidGuard, UserDetailsService, FreindsDetailsService, ProfileService, SocketService, GroupsService, Countries,  { provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
