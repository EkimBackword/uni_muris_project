export interface IGroup {
    ID: number;
    Title: string;

    Students?: IUser[];
    Lessons?: ILesson[];
}

export interface IUser {
    ID?: number;
    Login: string;
    FIO: string;
    Role: UserRoles;
    Hash: string;
    StartYear?: number;
    GroupID?: number;

    Group?: IGroup;
    Subjects?: ISubject[];
    LessonsInfo?: IStudentToLesson[];
}

export interface ISubject {
    ID?: number;
    Title: string;

    Teachers?: IUser[];
    Lessons?: ILesson[];
}

export interface IFile {
    ID: number;
    Path: string;
    Name: string;
    Ext: string;

    StudentInfoID?: number;
    LessonID?: number;

    StudentInfo?: IStudentToLesson;
    Lesson?: ILesson;
}

export interface ILesson {
    ID: number;
    SubjectID: number;
    GroupID: number;
    Date: Date;
    Title: string;
    Description: string;

    Group?: IGroup;
    Subject?: ISubject;

    StudentsInfo?: IStudentToLesson[];
    Files?: IFile[];
}

export interface IStudentToLesson {
    ID: number;
    UserID: number;
    LessonID: number;
    VisitStatus: VisitStatusEnum;
    Description: string;

    Student?: IUser;
    Lesson?: ILesson;
    Files?: any[];
}

export enum VisitStatusEnum {
    unknown,
    visit,
    miss
}

export enum UserRoles {
    admin = 'admin',
    student = 'student',
    teacher = 'teacher'
}
