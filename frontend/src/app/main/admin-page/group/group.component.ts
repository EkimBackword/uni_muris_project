import { GroupService } from './../../../../services/group.service';
import { UserService } from './../../../../services/user-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    MatTableDataSource,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatPaginator,
    MatChipInputEvent,
    MatAutocompleteSelectedEvent,
    MatDialog
} from '@angular/material';
import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { SubjectService } from '../../../../services/subject.service';
import { ISubject, UserRoles, IUser, IGroup } from './../../../../models/index';

@Component({
    selector: 'app-admin-group',
    templateUrl: 'group.component.html',
    styleUrls: ['./group.component.less']
})

export class AdminGroupComponent implements OnInit, AfterViewInit {
    constructor(
        private groupService: GroupService,
        public dialog: MatDialog
    ) { }

    displayedColumns = ['ID', 'Title', 'Actions'];
    dataSource = new MatTableDataSource<ISubject>([]);
    isLoading = true;

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
        this.dataSource.data = await this.groupService.list();
        this.isLoading = false;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    openDialog(group?: IGroup): void {
        const dialogRef = this.dialog.open(AdminGroupDialog, {
            width: '500px',
            data: { group: group }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.reload();
        });
    }

    async deleteGroup(group: IGroup) {
        await this.groupService.delete(group);
        this.reload();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
}

@Component({
    selector: 'app-admin-group-dialog',
    templateUrl: './dialogs/add-group.dialog.html',
    styleUrls: ['./group.component.less']
})
// tslint:disable-next-line:component-class-suffix
export class AdminGroupDialog implements OnInit {
    GroupForm: FormGroup;
    GroupID: number = null;

    constructor(
        public dialogRef: MatDialogRef<AdminGroupDialog>,
        private fb: FormBuilder,
        private groupService: GroupService,
        @Inject(MAT_DIALOG_DATA) public data: { group: IGroup }
    ) { }

    ngOnInit() {
        let title = '';
        if (this.data.group !== void 0) {
            this.GroupID = this.data.group.ID;
            title = this.data.group.Title;
        }

        this.GroupForm = this.fb.group({
            ID: [this.GroupID, Validators.required],
            Title: [title, Validators.required],
        });
    }

    CloseDialog(): void {
        this.dialogRef.close();
    }

    async AddGroup() {
        if (!this.GroupForm.valid) {
            return;
        }
        if (this.GroupID == null) {
            await this.groupService.add(this.GroupForm.value);
        } else {
            await this.groupService.edit(this.GroupForm.value);
        }
        this.CloseDialog();
    }
}
