import { Component, OnInit } from '@angular/core';
import { IUser, ILesson } from '../../../../models/index';
import { UserService } from '../../../../services/user-service.service';

@Component({
    selector: 'app-main-lessons',
    templateUrl: 'lessons.component.html',
    styleUrls: ['./lessons.component.less']
})

export class LessonsComponent implements OnInit {
    public profile: IUser = null;
    public SelectedLesson: ILesson = null;

    constructor(private userService: UserService) { }

    async ngOnInit() {
        this.profile = await this.userService.GetUser();
    }

    OnSeleced(lesson: ILesson) {
        console.log(lesson);
        this.SelectedLesson = lesson;
    }

    OnClose() {
        this.SelectedLesson = null;
    }
}
