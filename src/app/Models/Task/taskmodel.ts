export interface Taskmodel {
    employee_name: string;
    task_i_information_id? : string,
    task_name : string,
    description : string,
    task_category : string,
    s_bpartner_employee_id? : number,
    created_by : number,
    task_status: string,
    firstname?:string,
    lastname?:string,
}
