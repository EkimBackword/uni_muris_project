import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LessonComponent } from './lesson/lesson.component';
import { AdminPageComponent } from './main/admin-page/admin-page.component';
import { UniPageComponent } from './main/uni-page/uni-page.component';
import { AdminSubjectComponent } from './main/admin-page/subject/subject.component';
import { AdminUserComponent } from './main/admin-page/user/user.component';
import { AdminGroupComponent } from './main/admin-page/group/group.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main',
    component: MainComponent,
    children: [
      { path: 'admin', component: AdminPageComponent,
        children: [
          { path: 'group', component: AdminGroupComponent},
          { path: 'subject', component: AdminSubjectComponent},
          { path: 'user', component: AdminUserComponent}
        ]
      },
      { path: 'uni', component: UniPageComponent },
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class MainRoutingModule {}
