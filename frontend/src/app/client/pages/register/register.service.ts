import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
private baseUrl = 'http://localhost:8600/api';
  constructor(private http: HttpClient) { }

  organizerRegistration(requestObject?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/organizer-registration`, { requestObject });
  }
}
