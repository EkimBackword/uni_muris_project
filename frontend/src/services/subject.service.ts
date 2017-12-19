import { environment } from './../environments/environment';
import { ISubject } from './../models/index';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SubjectService {
    constructor(private http: HttpClient) { }

    async search(term: string) {
        if (term.length === 0) {
            return [];
        }
        try {
            return await this.http.get<ISubject[]>(`${environment.backendUrl}/subject/search/${term}`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async list() {
        try {
            return await this.http.get<ISubject[]>(`${environment.backendUrl}/subject/list`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async listByGroupID(GroupID: number) {
        try {
            return await this.http.get<ISubject[]>(`${environment.backendUrl}/subject/list/${GroupID}`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async add(subject: ISubject) {
        try {
            return await this.http.post(`${environment.backendUrl}/subject/add`, subject).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async edit(subject: ISubject) {
        try {
            return await this.http.patch(`${environment.backendUrl}/subject/edit/${subject.ID}`, subject).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async delete(subject: ISubject) {
        try {
            return await this.http.delete(`${environment.backendUrl}/subject/${subject.ID}`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }
}
