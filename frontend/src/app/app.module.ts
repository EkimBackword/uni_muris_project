import { SubjectService } from './../services/subject.service';
import { GroupService } from './../services/group.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LessonComponent } from './lesson/lesson.component';

import { MainRoutingModule } from './appRouting.routing';
import { AppInterceptor } from './interceptor';
import { UserService } from '../services/user-service.service';
import { MainComponent } from './main/main.component';
import { AdminPageComponent } from './main/admin-page/admin-page.component';
import { AdminUserComponent, AdminUserDialog } from './main/admin-page/user/user.component';
import { MaterialModule } from './material.module';
import { AdminSubjectComponent, AdminSubjectDialog } from './main/admin-page/subject/subject.component';
import { AdminGroupDialog, AdminGroupComponent } from './main/admin-page/group/group.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    LessonComponent,
    MainComponent,
    AdminPageComponent,
    AdminUserComponent,
    AdminSubjectComponent,
    AdminGroupComponent,
    AdminUserDialog,
    AdminSubjectDialog,
    AdminGroupDialog
],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    MainRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    UserService,
    GroupService,
    SubjectService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AdminUserDialog,
    AdminSubjectDialog,
    AdminGroupDialog
  ]
})
export class AppModule { }
