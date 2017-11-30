import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: string;
  password: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  async Login() {
    try {
      await this.userService.LogIn(this.login, this.password);
      // this.router.navigate(['/main']);
    } catch (e) {
      console.log(e);
    }
  }

  async logout() {
    try {
      await this.userService.LogOut();
      this.router.navigate(['/main']);
    } catch (e) {
      console.log(e);
    }
  }

  async test() {
    try {
      await this.userService.Test();
      this.router.navigate(['/main']);
    } catch (e) {
      console.log(e);
    }
  }

}
