import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskRemind } from 'src/app/Models/Task/Remind/task-remind.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TaskremindService {

  private apiUrl = `${environment.apiUrl}/dueReminder`;

  constructor(private http: HttpClient) { }

  displayReminder() : Observable<TaskRemind[]>{
    return this.http.get<TaskRemind[]>(this.apiUrl);
  }

  displayTaskRemindInfo(id: number): Observable<TaskRemind[]>{
    return this.http.get<TaskRemind[]>(`${this.apiUrl}/displayUserTask/${id}`);
  }

  NewReminder(post: TaskRemind) : Observable<TaskRemind>{
    return this.http.post<TaskRemind>(this.apiUrl, post);
  }
}
