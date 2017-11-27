import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { LessonsListComponent } from './LessonsList/LessonsList.component';
import { AdminPageComponent } from './AdminPage/AdminPage.component';
import { NotFoundComponent } from './NotFound/NotFound.component';
import { LessonComponent } from './lesson/lesson.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  { path: 'lessons', component: LessonsListComponent },
  { path: 'lesson/:subject/:groupe/:lessonid', component: LessonComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: '**', component: NotFoundComponent }
];

export const AppRoutingRoutes = RouterModule.forRoot(routes);
