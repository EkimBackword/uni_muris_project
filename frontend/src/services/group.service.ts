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
}
