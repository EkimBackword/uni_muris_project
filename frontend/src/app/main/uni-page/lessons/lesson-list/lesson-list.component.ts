import { ILesson, IGroup } from './../../../../../models/index';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IUser, UserRoles, ISubject } from '../../../../../models/index';
import { UserService } from '../../../../../services/user-service.service';
import { SubjectService } from '../../../../../services/subject.service';
import { LessonService } from '../../../../../services/lesson.service';
import { MatDialog } from '@angular/material';
import { AddLessonDialog } from './dialogs/add-lesson.dialog';
import { FormControl } from '@angular/forms';
import { GroupService } from '../../../../../services/group.service';
import {  } from '@angular/core/src/metadata/directives';

@Component({
    selector: 'app-main-lesson-list',
    templateUrl: 'lesson-list.component.html',
    styleUrls: ['./lesson-list.component.less']
})

export class LessonListComponent implements OnInit {
    @Input() public profile: IUser;
    @Output() OnSelected = new EventEmitter<ILesson>();
    @Output() OnReload = new EventEmitter();

    public isTeacher: boolean;
    public Subjects: ISubject[];
    public Group: FormControl = new FormControl();
    public filteredGroup: Promise<IGroup[]>;

    public isLoading: boolean;
    public Lessons: ILesson[];

    private SelectedSubjectID: number = null;
    private SelectedGroupID: number = null;
    private SelectedLessonID: number = null;

    constructor(
        private userService: UserService,
        private subjectService: SubjectService,
        private lessonService: LessonService,
        private groupService: GroupService,
        public dialog: MatDialog
    ) { }

    async ngOnInit() {
        this.isTeacher = this.profile.Role === UserRoles.teacher;
        if (this.isTeacher) {
            const user = await this.userService.GetUser({withSubject: true});
            this.Group.valueChanges.subscribe(async (term: string) => {
                this.filteredGroup = this.groupService.search(term);
            });
            this.Subjects = user.Subjects;
        } else {
            this.SelectedGroupID = this.profile.GroupID;
            this.Subjects = await this.subjectService.listByGroupID(this.profile.GroupID);
        }
    }

    async selectSubject(subject: ISubject) {
        this.SelectedSubjectID = subject.ID;
        this.reload();
    }

    async selectGroup(event) {
        this.SelectedGroupID = event.option.value;
        this.reload();
    }

    openDialog(lesson?: ILesson): void {
        const dialogRef = this.dialog.open(AddLessonDialog, {
            width: '500px',
            data: { subjects: this.Subjects, lesson, SubjectID: this.SelectedSubjectID, GroupID: this.SelectedGroupID }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.reload();
        });
    }

    async reload() {
        if (this.SelectedSubjectID === null || this.SelectedGroupID === null) {
            return;
        }
        this.isLoading = true;
        this.OnReload.emit();
        setTimeout(async () => {
            const lessons = await this.lessonService.list({ groupID: this.SelectedGroupID, subjectID: this.SelectedSubjectID });
            this.Lessons = lessons.sort((a, b) => a.Date > b.Date ? 1 : a.Date < b.Date ? -1 : 0);
            this.isLoading = false;
        }, 200);
    }

    SelectLesson(lesson: ILesson) {
        this.SelectedLessonID = lesson.ID;
        this.OnSelected.emit(lesson);
    }

    async DeleteLesson(lesson: ILesson) {
        await this.lessonService.delete(lesson);
        this.reload();
    }
}
