import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RelationTypeSearchComponent } from './relation-type-search/relation-type-search.component';
import {JdmRequestService} from './jdm-request.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    RelationTypeSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [JdmRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
