import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Taskfile } from 'src/app/Models/TaskFile/taskfile.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = `${environment.apiUrl}/taskFile`;

  constructor(private http: HttpClient) { }

  displayTaskFile(): Observable<Taskfile[]>{  
    return this.http.get<Taskfile[]>(this.apiUrl);
  }

  uploadTaskFile(post: Taskfile): Observable<Taskfile> {
    return this.http.post<Taskfile>(`${this.apiUrl}`, post);
  }

  displayUserTaskFile(id: number): Observable<Taskfile[]>{
    return this.http.get<Taskfile[]>(`${this.apiUrl}/displayUserTask/${id}`);
  }

  downloadTaskFile(fileId: number) {
    return this.http.get<{ file_name: string, file_data: string }>(
      `${this.apiUrl}/download/${fileId}`
    );
  }
}
