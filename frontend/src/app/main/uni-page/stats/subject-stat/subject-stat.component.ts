import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LessonService } from '../../../../../services/lesson.service';
import { GroupService } from '../../../../../services/group.service';
import { UserService } from '../../../../../services/user-service.service';
import { IUser, ILesson, VisitStatusEnum } from '../../../../../models/index';

@Component({
    selector: 'app-main-subject-stat',
    templateUrl: 'subject-stat.component.html',
    styleUrls: ['./subject-stat.component.less']
})

export class SubjectStatComponent implements OnInit {
    @Input('selected')
    set Selected(value) {
        this.selected = value;
        console.log(value);
    }
    @Input() public profile: IUser;
    @Output() OnClosed = new EventEmitter();

    public selected: {SubjectID: number, GroupID: number};

    public students: IUser[];
    public lessons: ILesson[];
    public Scores: { [key: string]: number};
    public VisitStatus: { [key: string]: VisitStatusEnum};

    constructor(
        private lessonService: LessonService,
        private userService: UserService
    ) { }

    async ngOnInit() {
        this.Scores = {};
        this.VisitStatus = {};
        this.lessons = await this.lessonService.list({
            subjectID: this.selected.SubjectID,
            groupID: this.selected.GroupID,
            withStudInfo: true
        });
        this.students = await this.userService.GetList({GroupID: this.selected.GroupID});
        this.lessons.forEach(lesson => {
            lesson.StudentsInfo.forEach(StudInfo => {
                this.Scores[`${StudInfo.UserID}_${lesson.ID}`] = StudInfo.Score;
                this.VisitStatus[`${StudInfo.UserID}_${lesson.ID}`] = StudInfo.VisitStatus;
            });
        });
    }

    close() {
        this.OnClosed.emit();
    }

    public async ChangeVisitInfo(studentID, lessonID, value) {
        if (this.profile.Role === 'teacher') {
            this.VisitStatus[`${studentID}_${lessonID}`] = value;
            await this.lessonService.set(lessonID, studentID, 'VisitInfo', value);
        }
    }

    public async ChangeScore(studentID, lessonID, value) {
        if (
            this.profile.Role !== 'teacher' ||
            (this.Scores[`${studentID}_${lessonID}`] === 0 && value === -1) ||
            (this.Scores[`${studentID}_${lessonID}`] === 5 && value === 1)
        ) {
            return;
        }
        this.Scores[`${studentID}_${lessonID}`] += value;
        await this.lessonService.set(lessonID, studentID, 'Score', this.Scores[`${studentID}_${lessonID}`]);
    }

}
