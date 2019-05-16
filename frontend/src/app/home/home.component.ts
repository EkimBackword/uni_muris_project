import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { Router, NavigationEnd } from '@angular/router';
import { IUser } from '../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  user: IUser;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.user = await this.userService.GetUser();
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        this.user = await this.userService.GetUser();
        console.log(this.user);
      }
    });
  }
}
