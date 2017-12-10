import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IUser, UserRoles} from '../models/index';
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

    async search(term: string, option?: { role: string }) {
        if (term.length === 0) {
            return [];
        }
        try {
            let url = `${environment.backendUrl}/user/search/${term}`;
            if (option !== void 0) {
                Object.keys(option).forEach((key, index) => {
                    url += index === 0 ? '?' : '&';
                    url += `${key}=${option[key]}`;
                });
            }
            return await this.http.get<IUser[]>(url).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    public async AddUser(user: IUser) {
        try {
            return await this.http.post<IUser[]>(`${environment.backendUrl}/user/add`, user).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    public async SaveUser(user: IUser) {
        try {
            return await this.http.patch<IUser[]>(`${environment.backendUrl}/user/edit/${user.ID}`, user).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    public async DeleteUser(user: IUser) {
        try {
            return await this.http.delete<void>(`${environment.backendUrl}/user/${user.ID}`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }
}
