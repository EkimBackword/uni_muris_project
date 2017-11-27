import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { LessonsListComponent } from './LessonsList/LessonsList.component';
import { AdminPageComponent } from './AdminPage/AdminPage.component';
import { NotFoundComponent } from './NotFound/NotFound.component';
import { LessonComponent } from './lesson/lesson.component';

import { AppRoutingRoutes } from './appRouting.routing';
import { UserService } from '../services/user-service.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    LessonsListComponent,
    AdminPageComponent,
    NotFoundComponent,
    LessonComponent
],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingRoutes
  ],
  providers: [
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
