import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDue } from 'src/app/Models/Task/Due/task-due.model';
import { TaskDueList } from 'src/app/Models/Task/TaskDue/task-due-list';
import { Taskmodel } from 'src/app/Models/Task/taskmodel';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/task`;

  constructor(private http: HttpClient) {}

  displayTask(): Observable<Taskmodel[]> {
    return this.http.get<Taskmodel[]>(this.apiUrl);
  }

  displayTaskInfo(id: number): Observable<Taskmodel> {
    return this.http.get<Taskmodel>(`${this.apiUrl}/displayTask/${id}`);
  }

  addNewTask(post: Taskmodel): Observable<Taskmodel> {
    return this.http.post<Taskmodel>(this.apiUrl, post);
  }

  updateNewTask(id : number): Observable<Taskmodel>{
    return this.http.put<Taskmodel>(`${this.apiUrl}/DoneTask/${id}`, {})
  }

  removeTask(id : number): Observable<Taskmodel>{
    return this.http.put<Taskmodel>(`${this.apiUrl}/removeTask/${id}`, {})
  }

  displayUserTask(
    id: number,
    status?: string,
    type?: string
  ): Observable<TaskDueList[]> {
    const params: any = {};
    if (status) params.status = status;
    if (type) params.type = type;

    return this.http.get<TaskDueList[]>(`${this.apiUrl}/UserTask/${id}`, {
      params,
    });
  }

  displayTaskDues(
    status?: string,
    type?: string,
    assigned?: string
  ): Observable<TaskDueList[]> {
    const params: any = {};
    if (status) params.status = status;
    if (type) params.type = type;
    if (assigned) params.assigned = assigned;

    return this.http.get<TaskDueList[]>(`${this.apiUrl}/dues`, { params });
  }

  getTaskStatusCounts(
    id: number
  ): Observable<{
    DEADLINE: number;
    ACTIVE: number;
    TEAM_PENDING: number;
    TEAM_ACTIVE: number;
    OWN_PENDING: number;
    OWN_ACTIVE: number;
    TEAM_PENDING_PERCENT: number;
    TEAM_ACTIVE_PERCENT: number;
    Team_Total_Pending: number;
    Team_Total_Active: number;
  }> {
    return this.http.get<{
      DEADLINE: number;
      ACTIVE: number;
      TEAM_PENDING: number;
      TEAM_ACTIVE: number;
      OWN_PENDING: number;
      OWN_ACTIVE: number;
      TEAM_PENDING_PERCENT: number;
      TEAM_ACTIVE_PERCENT: number;
      Team_Total_Pending: number;
      Team_Total_Active: number;
    }>(`${this.apiUrl}/chart/${id}`);
  }

  getTeamProgress(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/progress/${id}`);
  }
}
