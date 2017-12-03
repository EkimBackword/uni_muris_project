import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UserService } from '../../../services/user-service.service';
import { IUser, UserRolesDesc, UserRoles } from '../../../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-main-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.less']
})
export class AdminPageComponent implements OnInit {

  displayedColumns = ['Login', 'FIO', 'Role', 'Group', 'StartYear', 'Actions'];
  dataSource = new MatTableDataSource<IUser>([]);
  userRolesDesc = UserRolesDesc;
  newUser: IUser;
  userForm: FormGroup;

  isLoading = true;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.reload();
  }

  createForm() {
    this.userForm = this.fb.group({
      Login: ['', Validators.required],
      FIO: ['', Validators.required],
      Password: ['', Validators.required],
      rePassword: ['', Validators.required],
      Role: [UserRoles.student, Validators.required],
      Group: [''],
      StartYear: [''],
    });
  }

  async AddUser() {
    const user = this.userForm.value;
    if (user.Password === user.rePassword) {
      delete user.rePassword;
      await this.userService.AddUser(user);
      this.reload();
    } else {
      console.log('Пароли');
    }
  }

  async reload() {
    this.isLoading = true;
    this.dataSource.data = await this.userService.GetList();
    this.createForm();
    this.isLoading = false;
  }

}
