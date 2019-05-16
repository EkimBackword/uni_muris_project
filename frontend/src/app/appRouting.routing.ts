import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminPageComponent } from './main/admin-page/admin-page.component';
import { UniPageComponent } from './main/uni-page/uni-page.component';
import { AdminSubjectComponent } from './main/admin-page/subject/subject.component';
import { AdminUserComponent } from './main/admin-page/user/user.component';
import { AdminGroupComponent } from './main/admin-page/group/group.component';
import { HomeComponent } from './home/home.component';
import { NewsAdminComponent } from './news-admin/news-admin.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CoursesComponent } from './courses/courses.component';
import { DialogsComponent } from './dialogs/dialogs.component';
import { TelegramComponent } from './telegram/telegram.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'news-admin', component: NewsAdminComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'courses', component: CoursesComponent },
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
  { path: 'dialogs', component: DialogsComponent },
  { path: 'telegram', component: TelegramComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class MainRoutingModule {}
