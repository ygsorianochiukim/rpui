import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teamaccess } from 'src/app/Models/TeamAccess/teamaccess';
import { TeamList } from 'src/app/Models/TeamHeirarchy/team-list';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TeamaccessService {

  private apiUrl = `${environment.apiUrl}/teamAccess`;

  constructor(private http: HttpClient) { }

  displayTeamMember() : Observable<Teamaccess[]>{
    return this.http.get<Teamaccess[]>(this.apiUrl);
  }

  addNewTask(post: Teamaccess) : Observable<Teamaccess>{
    return this.http.post<Teamaccess>(`${this.apiUrl}`, post);
  }

  teamList(id:number): Observable<TeamList[]>{
    return this.http.get<TeamList[]>(`${this.apiUrl}/list/${id}`)
  }
  
  teamDropDown(id:number): Observable<TeamList[]>{
    return this.http.get<TeamList[]>(`${this.apiUrl}/dropdown/${id}`)
  }

  removeTeam(id: number): Observable<TeamList>{
    return this.http.patch<TeamList>(`${this.apiUrl}/${id}/remove`, {});
  }
}
