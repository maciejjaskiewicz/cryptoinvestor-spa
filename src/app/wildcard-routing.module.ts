import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoute: Routes = [
  { path: '**', redirectTo: '/app' }
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoute)
  ],
  exports: [RouterModule]
})

export class WildcardRoutingModule {}
