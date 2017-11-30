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

    public async LogIn(Login, Password) {
        try {
            this.CurrentUser = await this.http.post<IUser>('http://localhost:35123/user/login', { Login, Password }).toPromise();
            return this.CurrentUser;
        } catch (e) {
            throw e;
        }
    }

    public async LogOut() {
        try {
            return await this.http.get('http://localhost:35123/user/logout').toPromise();
        } catch (e) {
            throw e;
        }
    }

    public async Test() {
        try {
            return await this.http.get('http://localhost:35123/user/test').toPromise();
        } catch (e) {
            throw e;
        }
    }
}
