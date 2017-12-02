import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UserService } from '../../../services/user-service.service';
import { IUser, UserRolesDesc } from '../../../models/user';

@Component({
  selector: 'app-main-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.less']
})
export class AdminPageComponent implements OnInit {

  displayedColumns = ['Login', 'FIO', 'Role', 'Group', 'StartYear'];
  dataSource = new MatTableDataSource<IUser>([]);
  userRolesDesc = UserRolesDesc;

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.dataSource.data = await this.userService.GetList();
  }

}
