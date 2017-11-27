import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private userService: UserService, private router: Router) {
  }

  async ngOnInit() {
    const user = await this.userService.GetUser();
    if (user == null) {
      await this.router.navigate(['/login']);
    } else {
      await this.router.navigate(['/main']);
    }
  }
}
