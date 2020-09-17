import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RelationTypeSearchComponent } from './relation-type-search/relation-type-search.component';
import {JdmRequestService} from './jdm-request.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
    RelationTypeSearchComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [JdmRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
