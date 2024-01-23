import { Routes } from '@angular/router';
import { ToDoListComponent } from './to-do-list/to-do-list.component';

export const routes: Routes = [
  { path: 'home', component: ToDoListComponent, pathMatch: 'full'},
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];
