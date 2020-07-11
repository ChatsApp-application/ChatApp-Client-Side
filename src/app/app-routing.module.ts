import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MychatsComponent} from './Routes/mychats/mychats.component';
import {ChatDetailsComponent} from './Routes/chat-details/chat-details.component';


const routes: Routes = [
  {path: '', redirectTo: 'mychats', pathMatch: 'full'},
  {path: 'mychats', component: MychatsComponent},
  {path: 'mychats/:id', component: ChatDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
