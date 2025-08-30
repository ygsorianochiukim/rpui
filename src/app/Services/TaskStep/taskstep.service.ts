import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tasksteps } from 'src/app/Models/TaskSteps/tasksteps.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskstepService {

  private apiUrl = `${environment.apiUrl}/steptask`;

  constructor(private http: HttpClient) { }

  displaySteps(): Observable<Tasksteps[]>{
    return this.http.get<Tasksteps[]>(this.apiUrl);
  }

  displayTaskStepInfo(id: number): Observable<Tasksteps[]>{
    return this.http.get<Tasksteps[]>(`${this.apiUrl}/displayUserTask/${id}`);
  }

  addNewSteps(post:Tasksteps): Observable<Tasksteps>{
    return this.http.post<Tasksteps>(this.apiUrl, post);
  }
}
