import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskRepeat } from 'src/app/Models/Task/Repeat/task-repeat.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TaskrepeatService {

  private apiUrl = `${environment.apiUrl}/dueRepeat`;

  constructor(private http: HttpClient) { }

  dislayRepeat() : Observable<TaskRepeat[]>{
    return this.http.get<TaskRepeat[]>(this.apiUrl);
  }

  displayTaskRepeatInfo(id: number): Observable<TaskRepeat[]>{
    return this.http.get<TaskRepeat[]>(`${this.apiUrl}/displayUserTask/${id}`);
  }

  addRepeat(post: TaskRepeat) : Observable<TaskRepeat>{
    return this.http.post<TaskRepeat>(this.apiUrl,post);
  }

  updateSelectedRepeatFrequency(id: number, taskRepeat: string): Observable<TaskRepeat>{
    return this.http.put<TaskRepeat>(`${this.apiUrl}/update/${id}`, {repeat_frequency: taskRepeat} );
  }
}
