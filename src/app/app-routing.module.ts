import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MychatsComponent} from './Routes/mychats/mychats.component';
import {ChatDetailsComponent} from './Routes/chat-details/chat-details.component';
import {UserFriendsComponent} from './Routes/user-friends/user-friends.component';


const routes: Routes = [
  {path: '', component: MychatsComponent},
  {path: 'mychats', component: MychatsComponent},
  {path: 'mychats/:id', component: ChatDetailsComponent},
  {path: 'friends', component: UserFriendsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
