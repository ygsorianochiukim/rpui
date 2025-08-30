import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tasknotes } from 'src/app/Models/TaskNotes/tasknotes.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasknoteService {

  private apiUrl = `${environment.apiUrl}/notetask`;

  constructor(private http: HttpClient) { }

  displayNote(): Observable<Tasknotes[]>{
    return this.http.get<Tasknotes[]>(this.apiUrl);
  }

  displayTaskStepInfo(id: number): Observable<Tasknotes[]>{
    return this.http.get<Tasknotes[]>(`${this.apiUrl}/displayUserTask/${id}`);
  }

  addNewNotes(post:Tasknotes): Observable<Tasknotes>{
    return this.http.post<Tasknotes>(this.apiUrl,post);
  }
}
