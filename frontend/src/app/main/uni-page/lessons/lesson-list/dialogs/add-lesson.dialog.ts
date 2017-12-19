import { FlowService } from './../../../../../../services/flow.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GroupService } from '../../../../../../services/group.service';
import { IGroup, ILesson, IUser, ISubject } from '../../../../../../models/index';
import { LessonService } from '../../../../../../services/lesson.service';

@Component({
    selector: 'app-add-lesson-dialog',
    templateUrl: './add-lesson.dialog.html',
    // styleUrls: ['../lesson-list.component.less']
})
// tslint:disable-next-line:component-class-suffix
export class AddLessonDialog implements OnInit {
    LessonForm: FormGroup;
    LessonID: number = null;
    filteredGroup: Promise<IGroup[]>;

    constructor(
        public dialogRef: MatDialogRef<AddLessonDialog>,
        private fb: FormBuilder,
        private lessonService: LessonService,
        private groupService: GroupService,
        private flowService: FlowService,
        @Inject(MAT_DIALOG_DATA) public data: { lesson: ILesson, subjects: ISubject[], GroupID?: number, SubjectID?: number }
    ) { }

    ngOnInit() {
        this.LessonForm = this.fb.group({
            SubjectID: [this.data.SubjectID || null, Validators.required],
            GroupID: [this.data.GroupID || null, Validators.required],
            Title: ['', Validators.required],
            Description: ['', Validators.required],
            Date: [null, Validators.required],
        });

        if (this.data.lesson !== void 0) {
            this.LessonForm.patchValue({
                SubjectID: this.data.lesson.SubjectID,
                GroupID: this.data.lesson.GroupID,
                Title: this.data.lesson.Title,
                Description: this.data.lesson.Description,
                Date: this.data.lesson.Date
            });
            this.LessonID = this.data.lesson.ID;
        }

        this.LessonForm.get('GroupID').valueChanges.subscribe(async (term: string) => {
            this.filteredGroup = this.groupService.search(term);
        });

        this.flowService.assignBrowse('flow__button');
        this.flowService.onFileAdded.subscribe((data) => {
            console.log('onFileAdded', data);
            data.file.flowObj.upload();
        });
        this.flowService.onUploadStart.subscribe(() => {
            console.log('onUploadStart');
        });

        this.flowService.onUploadComplete.subscribe(() => {
            console.log('onUploadComplete');
        });
    }

    CloseDialog(): void {
        this.dialogRef.close();
    }

    async SaveLesson() {
        if (!this.LessonForm.valid) {
            return;
        }
        if (this.LessonID === null) {
            await this.lessonService.add(this.LessonForm.value);
        } else {
            const lesson: ILesson = this.LessonForm.value;
            lesson.ID = this.LessonID;
            await this.lessonService.edit(lesson);
        }
        this.CloseDialog();
    }
}
