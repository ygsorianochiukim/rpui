import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDue } from 'src/app/Models/Task/Due/task-due.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TaskdueService {

  private apiUrl =`${environment.apiUrl}/taskDue`;

  constructor(private http : HttpClient) { }

  displaytaskDue(): Observable<TaskDue[]>{
    return this.http.get<TaskDue[]>(this.apiUrl);
  }

  displayTaskDueInfo(id: number): Observable<TaskDue[]>{
    return this.http.get<TaskDue[]>(`${this.apiUrl}/displayUserTask/${id}`);
  }

  newDueDate(post:TaskDue): Observable<TaskDue>{
    return this.http.post<TaskDue>(this.apiUrl, post);
  }

  updateTaskDue(id:number): Observable<TaskDue>{
    return this.http.post<TaskDue>(`${this.apiUrl}/complete/${id}`, {});
  }

  updateSelectedDue(id: number, taskDue: string): Observable<TaskDue>{
    return this.http.put<TaskDue>(`${this.apiUrl}/update/${id}`, {due_date: taskDue} );
  }
}
