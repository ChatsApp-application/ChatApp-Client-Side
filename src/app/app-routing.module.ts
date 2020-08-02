import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MychatsComponent} from './Routes/mychats/mychats.component';
import {ChatDetailsComponent} from './Routes/chat-details/chat-details.component';
import {UserFriendsComponent} from './Routes/user-friends/user-friends.component';
import {LoginComponent} from './Routes/login/login.component';
import {RegisterComponent} from './Routes/register/register.component';
import {ValidGuard} from './Services/Gaurd/valid.guard';
import {InvalidGuard} from './Services/Gaurd/invalid.guard';
import {NotfoundComponent} from './Routes/notfound/notfound.component';
import {FindPeopleComponent} from './Routes/find-people/find-people.component';
import {ProfileComponent} from './Routes/profile/profile.component';
import {GroupsComponent} from './Routes/groups/groups.component';
import {GroupDetailsComponent} from './Routes/group-details/group-details.component';


const routes: Routes = [
  {path: 'mychats', component: MychatsComponent, canActivate: [ValidGuard]},
  {path: '', redirectTo: 'mychats', pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'mychats/:id', component: ChatDetailsComponent, canActivate: [ValidGuard]},
  {path: 'people', component: FindPeopleComponent, canActivate: [ValidGuard]},
  {path: 'groups', component: GroupsComponent, canActivate: [ValidGuard]},
  {path: 'groups/:id', component: GroupDetailsComponent, canActivate: [ValidGuard]},
  {path: 'profile/:id', component: ProfileComponent, canActivate: [ValidGuard]},
  {path: 'friends', component: UserFriendsComponent, canActivate: [ValidGuard]},
  {path: 'login', component: LoginComponent, canActivate: [InvalidGuard]},
  {path: '**', component: NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

