import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IUser, ISubject, IGroup, UserRoles } from '../../../../../models/index';
import { UserService } from '../../../../../services/user-service.service';
import { SubjectService } from '../../../../../services/subject.service';
import { LessonService } from '../../../../../services/lesson.service';
import { GroupService } from '../../../../../services/group.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-main-subject-list',
    templateUrl: 'subject-list.component.html',
    styleUrls: ['./subject-list.component.less']
})

export class SubjectListComponent implements OnInit {

    @Input() public profile: IUser;
    @Output() OnSelected = new EventEmitter<{SubjectID: number, GroupID: number}>();

    public isTeacher: boolean;
    public Group: FormControl = new FormControl();
    public filteredGroup: Promise<IGroup[]>;
    public Subjects: ISubject[];

    public SelectedGroupID: number = null;
    public SelectedSubjectID: number = null;

    constructor(
        private userService: UserService,
        private subjectService: SubjectService,
        private lessonService: LessonService,
        private groupService: GroupService,
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

    async selectGroup(event) {
        this.SelectedGroupID = event.option.value;
        this.Select();
    }

    Select(subject?: ISubject) {
        if (subject !== void 0) {
            this.SelectedSubjectID = subject.ID;
        }
        if (this.SelectedSubjectID !== null && this.SelectedGroupID !== null) {
            this.OnSelected.emit({SubjectID: this.SelectedSubjectID, GroupID: this.SelectedGroupID});
        }
    }
}
