import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageTrackerComponent } from './components/package-tracker/package-tracker.component';

const routes: Routes = [
  { path: 'package-tracker', component: PackageTrackerComponent},
  { path: '', redirectTo: 'package-tracker', pathMatch: 'full'},
  { path: '**', redirectTo: '/package-tracker' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
