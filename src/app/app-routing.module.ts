import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageTrackerComponent } from './components/package-tracker/package-tracker.component';

const routes: Routes = [
  { path: '', component: PackageTrackerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
