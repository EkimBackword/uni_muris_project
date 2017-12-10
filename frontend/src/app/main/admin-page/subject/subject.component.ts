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
import { ISubject, UserRoles, IUser } from './../../../../models/index';

@Component({
    selector: 'app-admin-subject',
    templateUrl: 'subject.component.html',
    styleUrls: ['./subject.component.less']
})

export class AdminSubjectComponent implements OnInit, AfterViewInit {
    constructor(
        private subjectService: SubjectService,
        public dialog: MatDialog
    ) { }

    displayedColumns = ['ID', 'Title', 'TeacherString', 'Actions'];
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
        const subjects = await this.subjectService.list();
        this.dataSource.data = subjects.map(s => {
            s['TeacherString'] = s.Teachers.reduce((teachers, teacher, index) => {
                                    return index === 0 ? teacher.FIO : `${teachers}, ${teacher.FIO}`;
                                }, '');
            return s;
        });
        this.isLoading = false;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    openDialog(subject?: ISubject): void {
        const dialogRef = this.dialog.open(AdminSubjectDialog, {
            width: '500px',
            data: { subject: subject }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.reload();
        });
    }

    async deleteSubject(subject: ISubject) {
        await this.subjectService.delete(subject);
        this.reload();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
}

@Component({
    selector: 'app-admin-subject-dialog',
    templateUrl: './dialogs/add-subject.dialog.html',
    styleUrls: ['./subject.component.less']
})
// tslint:disable-next-line:component-class-suffix
export class AdminSubjectDialog implements OnInit {
    subjectForm: FormGroup;
    SubjectID: number = null;
    filteredTeachers: Promise<IUser[]>;
    teachers: IUser[] = [];

    constructor(
        public dialogRef: MatDialogRef<AdminSubjectDialog>,
        private fb: FormBuilder,
        private userService: UserService,
        private subjectService: SubjectService,
        @Inject(MAT_DIALOG_DATA) public data: { subject: ISubject }
    ) { }

    ngOnInit() {
        let title = '';
        if (this.data.subject !== void 0) {
            this.SubjectID = this.data.subject.ID;
            this.teachers = this.data.subject.Teachers;
            title = this.data.subject.Title;
        }

        this.subjectForm = this.fb.group({
            Title: [title, Validators.required],
            TeacherName: [''],
        });

        this.subjectForm.get('TeacherName').valueChanges.subscribe(async (term: string) => {
            this.filteredTeachers = this.userService.search(term, { role: UserRoles.teacher })
                                        .then(list => list.filter(u => this.teachers.every(t => t.ID !== u.ID)));
        });
    }

    addTeacher(event: MatAutocompleteSelectedEvent, teacherInput): void {
        const teacher = event.option.value;
        teacherInput.value = '';

        if (teacher !== void 0) {
            this.teachers.push(teacher);
        }
    }

    removeTeacher(teacher: IUser) {
        const index = this.teachers.indexOf(teacher);
        this.teachers.splice(index, 1);
    }

    CloseDialog(): void {
        this.dialogRef.close();
    }

    async AddSubject() {
        if (!this.subjectForm.valid) {
            return;
        }
        const subject: any = {
            ID: this.SubjectID,
            Title: this.subjectForm.value.Title,
            TeachersID: this.teachers.map(t => t.ID)
        };
        if (this.SubjectID != null) {
            await this.subjectService.edit(subject);
        } else {
            await this.subjectService.add(subject);
        }
        this.CloseDialog();
    }
}
