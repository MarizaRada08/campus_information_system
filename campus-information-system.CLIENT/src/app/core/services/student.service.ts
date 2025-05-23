import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IStudent } from '../interfaces/studentInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _endpoint = `${environment.apiUrl}/api/v1/student`;

  constructor() { }

  getStudents(): Observable<IStudent[]> {
    return this._httpClient.get<IStudent[]>(this._endpoint);
  }

  addStudent(student: IStudent): Observable<IStudent> {
    return this._httpClient.post<IStudent>(this._endpoint, student);
  }
}
