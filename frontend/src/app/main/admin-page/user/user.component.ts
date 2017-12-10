import { GroupService } from './../../../../services/group.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from './../../../../services/user-service.service';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatPaginator } from '@angular/material';
import { Component, OnInit, Inject, ViewChild, AfterViewInit} from '@angular/core';
import { IUser, IGroup, UserRolesDesc, UserRoles } from './../../../../models/index';

@Component({
    selector: 'app-admin-user',
    templateUrl: 'user.component.html',
    styleUrls: ['./user.component.less']
})

export class AdminUserComponent implements OnInit, AfterViewInit {
    constructor(
        private userService: UserService,
        public dialog: MatDialog
    ) { }

    displayedColumns = ['Login', 'FIO', 'Role', 'GroupID', 'StartYear', 'Actions'];
    dataSource = new MatTableDataSource<IUser>([]);
    allUser: IUser[];
    newUser: IUser;
    isLoading = true;

    filterRole = new FormControl();
    rolesList = Object.keys(UserRolesDesc).map(key => ({ type: key, text: UserRolesDesc[key]}));
    userRolesDesc = UserRolesDesc;

    // @ViewChild(MatPaginator) paginator: MatPaginator;

    private paginator: MatPaginator;
    @ViewChild(MatPaginator)
    set _paginator(paginator: MatPaginator) {
        this.paginator = paginator;
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.reload();
    }

    async reload() {
        this.isLoading = true;
        this.allUser = await this.userService.GetList();
        this.dataSource.data = this.allUser;
        this.filterRole.setValue(this.rolesList.map(role => role.type));
        this.filterRole.valueChanges.subscribe((val: string[]) => {
            this.dataSource.data = this.allUser.filter(user => val.some(role => user.Role === role));
        });
        this.isLoading = false;
    }

    async DeleteUser(user) {
        try {
            await this.userService.DeleteUser(user);
            this.reload();
        } catch (err) {
            console.warn(err);
        }
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    openDialog(user?: IUser): void {
        const dialogRef = this.dialog.open(AdminUserDialog, {
            width: '500px',
            data: { user: user }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.reload();
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
}

@Component({
    selector: 'app-admin-user-dialog',
    templateUrl: './dialogs/add-user.dialog.html',
    styleUrls: ['./user.component.less']
})
// tslint:disable-next-line:component-class-suffix
export class AdminUserDialog implements OnInit {
    userForm: FormGroup;
    UserEditingID: number;
    filteredGroup: Promise<IGroup[]>;

    constructor(
        public dialogRef: MatDialogRef<AdminUserDialog>,
        private fb: FormBuilder,
        private userService: UserService,
        private groupService: GroupService,
        @Inject(MAT_DIALOG_DATA) public data: { user: IUser }
    ) { }

    ngOnInit() {
        if (this.data.user) {
            this.StartEditing(this.data.user);
        } else {
            this.createForm();
        }
    }

    CloseDialog(): void {
        // this.UserEditingID = null;
        this.dialogRef.close();
    }

    createForm() {
        this.UserEditingID = null;
        this.userForm = this.fb.group({
            Login: ['', Validators.required],
            FIO: ['', Validators.required],
            Password: ['', Validators.required],
            rePassword: ['', Validators.required],
            Role: [UserRoles.student, Validators.required],
            GroupID: [null],
            StartYear: [null],
        });

        this.userForm.get('GroupID').valueChanges.subscribe(async (term: string) => {
            this.filteredGroup = this.groupService.search(term);
        });
    }

    StartEditing(user: IUser) {
        this.UserEditingID = user.ID;
        this.userForm = this.fb.group({
            Login: [user.Login, Validators.required],
            FIO: [user.FIO, Validators.required],
            Password: [''],
            rePassword: [''],
            Role: [user.Role, Validators.required],
            GroupID: [user.GroupID],
            StartYear: [user.StartYear],
        });

        this.userForm.get('GroupID').valueChanges.subscribe(async (term: string) => {
            this.filteredGroup = this.groupService.search(term);
        });
    }

    async AddUser() {
        const user: IUser = this.userForm.value;
        if (this.UserEditingID !== null) {
            user.ID = this.UserEditingID;
            await this.userService.SaveUser(user);
            this.CloseDialog();
        } else if (user.Password === user.rePassword) {
            delete user.rePassword;
            await this.userService.AddUser(user);
            this.CloseDialog();
        } else {
            console.warn('Пароли');
        }
    }
}
