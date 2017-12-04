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
  UserEditingID: number;

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
    const user: IUser = this.userForm.value;
    if (user.Password === user.rePassword) {
      delete user.rePassword;

      if (this.UserEditingID !== null) {
        user.ID = this.UserEditingID;
        await this.userService.SaveUser(user);
      } else {
        await this.userService.AddUser(user);
      }
      this.reload();
    } else {
      console.warn('Пароли');
    }
  }

  async DeleteUser(user) {
    try {
      await this.userService.DeleteUser(user);
      this.reload();
    } catch (err) {
      console.warn(err);
    }
  }

  async reload() {
    this.isLoading = true;
    this.UserEditingID = null;
    this.dataSource.data = await this.userService.GetList();
    this.createForm();
    this.isLoading = false;
  }

  CancelEditing() {
    this.UserEditingID = null;
    this.createForm();
  }

  StartEditing(user: IUser) {
    this.UserEditingID = user.ID;
    this.userForm = this.fb.group({
      Login: [user.Login, Validators.required],
      FIO: [user.FIO, Validators.required],
      Password: ['', Validators.required],
      rePassword: ['', Validators.required],
      Role: [user.Role, Validators.required],
      Group: [''],
      StartYear: [''],
    });
  }

}
