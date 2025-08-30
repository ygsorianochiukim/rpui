import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from 'src/app/Models/Position/position';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private apiUrl = `${environment.apiUrl}/position`;

  constructor(private http : HttpClient) { }

  displayPosition(): Observable<Position[]>{
    return this.http.get<Position[]>(this.apiUrl);
  }

  addnewPosition(post: Position): Observable<Position>{
    return this.http.post<Position>(this.apiUrl, post);
  }
}
