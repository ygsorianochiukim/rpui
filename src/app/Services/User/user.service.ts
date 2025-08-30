import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/Models/User/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/userAccount`

  constructor(private http: HttpClient) { }

  displayuserList(): Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }

  userinformation(id: number): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/displayUser/${id}`);
  }
  
  addNewUser(post: User): Observable<User>{
    return this.http.post<User>(this.apiUrl, post);
  }

  sentOTP(id: number): Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/sentOTP/${id}`,{});
  }

  displayProfile(id: number): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/personalInfo/${id}`)
  }
}
