import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizersService {
  private baseUrl = 'http://localhost:8600/api';
  constructor(private http: HttpClient) {}
  upsertOrganizer(organizer?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/upsert-organizer`, { organizer });
  }

  getOrganizers(requestObject?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-organizers`, { requestObject });
  }

  deleteOrganizer(organizer?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete-organizer`, { organizer });
  }
}
