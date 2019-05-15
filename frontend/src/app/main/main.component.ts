import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { IUser, UserRolesDesc, UserRoles } from '../../models/index';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  profile: IUser;
  userRolesDesc = UserRolesDesc;

  constructor(private userService: UserService, private router: Router) { }

  async ngOnInit() {
    this.init();
    this.router.events.subscribe(async (event: any) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/main') {
        this.init();
      }
    });
  }

  async init() {
    this.profile = await this.userService.GetUser();
    if (this.profile === null) {
      this.router.navigate(['/login']);
      return;
    }
    switch (this.profile.Role) {
      case UserRoles.admin: {
        this.router.navigate(['/main/admin']);
        break;
      }
      default: {
        this.router.navigate(['/main/uni']);
        break;
      }
    }
  }

  async handleFileInput(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      try {
        await this.userService.uploadFile(files.item(i));
      } catch (e) {
        console.warn(e);
      }
    }
  }

}
