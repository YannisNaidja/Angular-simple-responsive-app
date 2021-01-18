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
import { AutoCompletionPipe } from './relation-type-search/auto-completion.pipe';
import { ReactiveFormsModule } from '@angular/forms';

import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    RelationTypeSearchComponent,
    HeaderComponent,
    AutoCompletionPipe
  ],
  imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      AppRoutingModule,
      ReactiveFormsModule,
      AngularMaterialModule,
      ScrollingModule
    ],
  providers: [JdmRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
