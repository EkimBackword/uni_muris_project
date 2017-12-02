export interface IUser {
    ID: number;
    Login: string;
    FIO: string;
    Role: UserRoles;
    Group?: number;
    StartYear?: number;
}

export enum UserRoles {
    admin = 'admin',
    student = 'student',
    teacher = 'teacher'
}

export const UserRolesDesc = {
    admin: 'Администратор',
    student: 'Студент',
    teacher: 'Преподаватель',
};

