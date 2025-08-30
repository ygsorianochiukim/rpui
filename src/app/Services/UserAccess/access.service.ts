import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Useraccess } from 'src/app/Models/UserAccess/useraccess.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  private apiUrl = `${environment.apiUrl}/userAccess`;

  constructor(private http : HttpClient) { }

  displayAccess(): Observable<Useraccess[]>{
    return this.http.get<Useraccess[]>(this.apiUrl);
  }

  newuserAccess(post:Useraccess): Observable<Useraccess>{
    return this.http.post<Useraccess>(this.apiUrl, post);
  }
}
