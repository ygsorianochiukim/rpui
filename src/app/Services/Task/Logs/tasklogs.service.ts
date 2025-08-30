import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskComplete } from 'src/app/Models/Task/Complete/task-complete.model';
import { Tasklogs } from 'src/app/Models/Task/Logs/tasklogs.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TasklogsService {

  private apiUrl = `${environment.apiUrl}/taskLogs`;

  constructor(private http: HttpClient) { }

  displayLogs(): Observable<Tasklogs[]>{
    return this.http.get<Tasklogs[]>(this.apiUrl);
  }

  addTaskLogs(post: Tasklogs) : Observable<Tasklogs>{
    return this.http.post<Tasklogs>(this.apiUrl , post);
  }

  displayComplete(): Observable<TaskComplete[]>{
    return this.http.get<TaskComplete[]>(`${this.apiUrl}/complete`);
  }
  displayCompleteUser(id: number): Observable<TaskComplete[]>{
    return this.http.get<TaskComplete[]>(`${this.apiUrl}/complete/${id}`);
  }
}
