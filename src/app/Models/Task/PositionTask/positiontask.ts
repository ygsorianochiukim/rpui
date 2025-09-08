export interface Positiontask {
    task_bank_id?: number,
    task_name: string,
    description: string,
    task_category: string,
    position_id?: number,
    due_date?: string,
    created_by?: number,
    date_selected?: string,
    position?: position | null;
}

export interface position{
    position?: string,
    function?: string,
}
