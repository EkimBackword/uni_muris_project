import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IUser, UserRoles} from '../models/user';

@Injectable()
export class UserService {

    private CurrentUser: IUser;

    constructor(private http: HttpClient) {
        this.CurrentUser = null;
    }

    public async GetUser() {
        return this.CurrentUser === null ? await this.SetUser() : this.CurrentUser;
    }

    private async SetUser() {
        try {
            this.CurrentUser = await this.http.get<IUser>('/user').toPromise();
            return this.CurrentUser;
        } catch (e) {
            return null;
        }
    }

}
