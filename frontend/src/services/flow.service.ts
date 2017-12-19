import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

declare const Flow: any;

@Injectable()
export class FlowService {

    private flow;

    public onFileAdded = new EventEmitter<{file: any, event: any}>();
    public onFileSuccess = new EventEmitter<{file: any, message: any}>();
    public onFileError = new EventEmitter<{file: any, message: any}>();
    public onUploadStart = new EventEmitter();
    public onUploadComplete = new EventEmitter();

    constructor(private httpClient: HttpClient) {
        this.flow = new Flow({
            target: `${environment.backendUrl}/files/upload`,
            query: { upload_token: 'my_token' },
            allowDuplicateUploads: true,
            speedSmoothingFactor: 0.02,
            simultaneousUploads: 3,
            maxChunkRetries: 5,
            chunkRetryInterval: 2000,
            withCredentials: true
        });

        if (!this.flow.support) {
            console.log('non support');
        }

        this.flow.on('catchAll', (...args) => {
            console.log('catchAll', ...args);
        });
        this.flow.on('fileAdded', (file, event) => {
            this.onFileAdded.emit({ file, event });
        });

        this.flow.on('fileSuccess', (file, message) => {
            this.onFileSuccess.emit({file, message});
        });

        this.flow.on('fileError', (file, message) => {
            this.onFileError.emit({file, message});
        });

        this.flow.on('complete', () => {
            this.onUploadComplete.emit();
        });
        this.flow.on('uploadStart', () => {
            this.onUploadStart.emit();
        });
    }

    assignBrowse(buttonID: string) {
        this.flow.assignBrowse(document.getElementById(buttonID));
    }

    assignDrop(DropID: string) {
        this.flow.assignDrop(document.getElementById(DropID));
    }

    upload() {
        this.flow.upload();
    }

}
