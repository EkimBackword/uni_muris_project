import { environment } from './../environments/environment';
import { IGroup } from './../models/index';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GroupService {
    constructor(private http: HttpClient) { }

    async search(term: string) {
        try {
            return await this.http.get<IGroup[]>(`${environment.backendUrl}/group/search/${term}`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }
    async list() {
        try {
            return await this.http.get<IGroup[]>(`${environment.backendUrl}/group/list`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }
    async add(group: IGroup) {
        try {
            return await this.http.post<void>(`${environment.backendUrl}/group/add`, group).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }
    async edit(group: IGroup) {
        try {
            return await this.http.patch<void>(`${environment.backendUrl}/group/edit/${group.ID}`, group).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }
    async delete(group: IGroup) {
        try {
            return await this.http.delete<void>(`${environment.backendUrl}/group/${group.ID}`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }
}
