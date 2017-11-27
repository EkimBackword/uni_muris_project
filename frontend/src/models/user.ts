export interface IUser {
    Login: string;
    FIO: string;
    Role: string;
    Group?: number;
}

export enum UserRoles {
    admin = 'admin',
    student = 'student',
    teacher = 'teacher'
}
