import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ILesson } from '../../../../../models/index';

@Component({
    selector: 'app-main-lesson',
    templateUrl: 'lesson.component.html',
    styleUrls: ['./lesson.component.less']
})

export class LessonComponent implements OnInit {
    @Input() public lesson: ILesson;
    @Output() OnClosed = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    close() {
        this.OnClosed.emit();
    }
}
