export interface User {
    firstname: string,
    lastname: string,
}

export interface Task {
    task_name: string,
    description: string,
}

export interface TaskComplete {
    TaskDateComplete: string,
    user : User,
    task : Task,
}
