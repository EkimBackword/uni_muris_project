import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IUser, UserRoles} from '../models/user';
import { environment } from '../environments/environment';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    public async GetUser() {
        try {
            return await this.http.get<IUser>(`${environment.backendUrl}/user/profile`).toPromise();
        } catch (e) {
            return null;
        }
    }

    public async LogIn(Login, Password) {
        try {
            return await this.http.post<IUser>(`${environment.backendUrl}/user/login`, { Login, Password }).toPromise();
        } catch (e) {
            throw e;
        }
    }

    public async LogOut() {
        try {
            return await this.http.get(`${environment.backendUrl}/user/logout`).toPromise();
        } catch (e) {
            throw e;
        }
    }

    public async GetList() {
        try {
            return await this.http.get<IUser[]>(`${environment.backendUrl}/user/list`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }
}
