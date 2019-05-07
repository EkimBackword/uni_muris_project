import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { IUser, UserRolesDesc, UserRoles } from '../../models/index';
import { Router } from '@angular/router';

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
    this.profile = await this.userService.GetUser();
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

  async LogOut() {
    try {
      await this.userService.LogOut();
    } catch (err) {
      console.log(err);
    }
    await this.userService.GetUser();
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
