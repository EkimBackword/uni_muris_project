import { Component, OnInit } from '@angular/core';
import { ISubject, IUser, IGroup } from '../../../../models/index';
import { UserService } from '../../../../services/user-service.service';

@Component({
    selector: 'app-main-stats',
    templateUrl: 'stats.component.html',
    styleUrls: ['./stats.component.less']
})

export class StatsComponent implements OnInit {
    public profile: IUser = null;
    public Selected: {SubjectID: number, GroupID: number} = null;

    constructor(private userService: UserService) { }

    async ngOnInit() {
        this.profile = await this.userService.GetUser();
    }

    OnSeleced(data: {SubjectID: number, GroupID: number}) {
        this.OnClose();
        setTimeout(() => {
            console.log(data);
            this.Selected = data;
        });
    }

    OnClose() {
        this.Selected = null;
    }
}
