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

import { MainRoutingModule } from './appRouting.routing';
import { AppInterceptor } from './interceptor';
import { UserService } from '../services/user-service.service';
import { MainComponent } from './main/main.component';
import { AdminPageComponent } from './main/admin-page/admin-page.component';
import { AdminUserComponent, AdminUserDialog } from './main/admin-page/user/user.component';
import { MaterialModule } from './material.module';
import { AdminSubjectComponent, AdminSubjectDialog } from './main/admin-page/subject/subject.component';
import { AdminGroupDialog, AdminGroupComponent } from './main/admin-page/group/group.component';

import { UniPageComponent } from './main/uni-page/uni-page.component';
import { LessonsComponent } from './main/uni-page/lessons/lessons.component';
import { LessonListComponent } from './main/uni-page/lessons/lesson-list/lesson-list.component';
import { StatsComponent } from './main/uni-page/stats/stats.component';
import { LessonComponent } from './main/uni-page/lessons/lesson/lesson.component';
import { LessonService } from '../services/lesson.service';
import { AddLessonDialog } from './main/uni-page/lessons/lesson-list/dialogs/add-lesson.dialog';
import { FlowService } from '../services/flow.service';
import { FileUploadModule } from 'ng2-file-upload';
import { UploadComponent } from './main/uni-page/upload/upload.component';
import { SubjectStatComponent } from './main/uni-page/stats/subject-stat/subject-stat.component';
import { SubjectListComponent } from './main/uni-page/stats/subject-list/subject-list.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    // LessonComponent,
    HomeComponent,
    MainComponent,
    UploadComponent,

    UniPageComponent,
    LessonsComponent,
    LessonListComponent,
    LessonComponent,
    StatsComponent,
    SubjectStatComponent,
    SubjectListComponent,


    AdminPageComponent,
    AdminUserComponent,
    AdminSubjectComponent,
    AdminGroupComponent,

    AdminUserDialog,
    AdminSubjectDialog,
    AdminGroupDialog,
    AddLessonDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    MainRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    UserService,
    GroupService,
    SubjectService,
    LessonService,
    FlowService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AdminUserDialog,
    AdminSubjectDialog,
    AdminGroupDialog,
    AddLessonDialog
  ]
})
export class AppModule { }
