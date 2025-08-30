import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Accessline } from 'src/app/Models/AccessLine/accessline.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessLineService {

  private apiUrl =`${environment.apiUrl}/accessLine`;

  constructor(private http: HttpClient) { }

  displayAccessLine():Observable<Accessline[]>{
    return this.http.get<Accessline[]>(this.apiUrl);
  }

  newAccessLine(post:Accessline): Observable<Accessline>{
    return this.http.post<Accessline>(this.apiUrl,post);
  }
}
