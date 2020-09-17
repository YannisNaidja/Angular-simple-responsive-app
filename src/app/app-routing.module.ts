import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RelationTypeSearchComponent } from './relation-type-search/relation-type-search.component';


const routes: Routes = [
    { path: "", component: RelationTypeSearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
