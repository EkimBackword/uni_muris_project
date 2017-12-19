import { environment } from './../environments/environment';
import { ILesson } from './../models/index';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';

@Injectable()
export class LessonService {
    constructor(private http: HttpClient) { }

    // async search(term: string) {
    //     if (term.length === 0) {
    //         return [];
    //     }
    //     try {
    //         return await this.http.get<ILesson[]>(`${environment.backendUrl}/lesson/search/${term}`).toPromise();
    //     } catch (e) {
    //         console.warn(e);
    //         return [];
    //     }
    // }

    async list(option?: {subjectID: number , groupID: number, withStudInfo?: boolean}) {
        try {
            let url = `${environment.backendUrl}/lesson/list`;
            if (option !== void 0) {
                Object.keys(option).forEach((key, index)  => {
                    url += index === 0 ? '?' : '&';
                    url += `${key}=${option[key]}`;
                });
            }
            return await this.http.get<ILesson[]>(url).toPromise();
        } catch (e) {
            // console.warn(e);
            if (e.status === 404) {
                throw new Error('Список не найден');
            }
            throw e;
        }
    }

    async getLesson(lessonID: number) {
        try {
            return await this.http.get<ILesson[]>(`${environment.backendUrl}/lesson/list/${lessonID}`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async add(lesson: ILesson) {
        try {
            return await this.http.post(`${environment.backendUrl}/lesson/add`, lesson).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async edit(lesson: ILesson) {
        try {
            return await this.http.patch(`${environment.backendUrl}/lesson/edit/${lesson.ID}`, lesson).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async delete(lesson: ILesson) {
        try {
            return await this.http.delete(`${environment.backendUrl}/lesson/${lesson.ID}`).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async set(lessonID: number, userID: number, type: string, value: number) {
        try {

            return await this.http.post(`${environment.backendUrl}/lesson/set`,
                {
                    lessonID,
                    userID,
                    type,
                    value
                }).debounceTime(250).toPromise();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }
}
