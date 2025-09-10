import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { parse } from 'papaparse';
import { environment } from 'src/environments/environment.prod';
import { Positiontask } from 'src/app/Models/Task/PositionTask/positiontask';

@Injectable({
  providedIn: 'root'
})
export class TaskPositionService {
  private apiUrl = `${environment.apiUrl}/task-bank`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Positiontask[]> {
    return this.http.get<Positiontask[]>(this.apiUrl);
  }
  getById(id: number): Observable<Positiontask> {
    return this.http.get<Positiontask>(`${this.apiUrl}/${id}`);
  }
  create(taskBank: Positiontask): Observable<Positiontask> {
    return this.http.post<Positiontask>(this.apiUrl, taskBank);
  }
  update(id: number, taskBank: Partial<Positiontask>): Observable<Positiontask> {
    return this.http.put<Positiontask>(`${this.apiUrl}/${id}`, taskBank);
  }
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
  syncByPosition(positionId: number, userId: number) {
    return this.http.post(`${this.apiUrl}/sync-by-position`, {
      position_id: positionId,
      user_id: userId
    });
  }
  taskUpdate(id: number, payload: any): Observable<Positiontask> {
    return this.http.put<Positiontask>(`${this.apiUrl}/${id}/update-sync`, payload);
  }
  syncSingleTask(taskBankId: number, positionId: number, userId: number): Observable<Positiontask> {
    return this.http.post<Positiontask>(`${this.apiUrl}/${taskBankId}/sync`, {
      position_id: positionId,
      user_id: userId
    });
  }
}
