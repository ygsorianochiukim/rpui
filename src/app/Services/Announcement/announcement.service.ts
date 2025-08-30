import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Announcement } from 'src/app/Models/Announcement/announcement';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  
  private apiUrl=`${environment.apiUrl}/announcement`

  constructor(private http: HttpClient) { }

  displayAnnouncement():Observable<Announcement[]>{
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  addNewAnnouncement(post: Announcement) : Observable<Announcement>{
    return this.http.post<Announcement>(this.apiUrl, post);
  }
}
