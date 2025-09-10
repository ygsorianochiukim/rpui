export interface Positiontask {
    task_bank_id?: number,
    task_name: string,
    description: string,
    task_category?: string,
    position_id?: number,
    due_date?: string,
    created_by?: number,
    date_selected?: string,
    task_notes?: string,
    task_step?: string,
    file?: string,
    repeat_frequency?: string,
    remind_task?: string,

    position?: position | null;
}

export interface position{
    position_id? : number;
    position?: string,
    function?: string,
}
