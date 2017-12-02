import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LessonComponent } from './lesson/lesson.component';
import { AdminPageComponent } from './main/admin-page/admin-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main',
    component: MainComponent,
    children: [
      { path: 'admin', component: AdminPageComponent },
    ]
  },
  { path: 'lesson/:subject/:groupe/:lessonid', component: LessonComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class MainRoutingModule {}
