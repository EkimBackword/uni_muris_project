import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { IUser, UserRolesDesc } from '../models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'app';
  user: IUser;
  isAuth: boolean;
  userRolesDesc = UserRolesDesc;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        this.user = await this.userService.GetUser();
        this.isAuth = this.router.url === '/login';
      }
    });
  }

  async LogOut() {
    try {
      await this.userService.LogOut();
      this.user = null;
      this.router.navigate(['/']);
    } catch (err) {
      console.log(err);
    }
  }

  async LogIn() {
    this.router.navigate(['/login']);
  }
}
