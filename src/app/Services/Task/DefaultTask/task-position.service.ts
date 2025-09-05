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
  private sheetUrl  = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhfDvacnU7LEPnqEGRB40PTr2i5kCeMsdxOC6-jbDlV7tcKf5b8unbxZCiADuh0iJuE-TJ6h5-EmCn/pub?gid=755485427&single=true&output=csv';
  private apiUrl = `${environment.apiUrl}/task-bank`;
  constructor(private http: HttpClient) {}

  getSheetData() {
    return this.http.get(this.sheetUrl, { responseType: 'text' }).pipe(
      map(csv => {
        const parsed = parse(csv, { header: false });
        return parsed.data;
      })
    );
  }
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
}
