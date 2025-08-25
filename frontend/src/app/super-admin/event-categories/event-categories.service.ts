import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventCategoriesService {
private baseUrl = 'http://localhost:8600/api';
  constructor(private http: HttpClient) {}
  upsertEventCategory(category?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/upsert-event-category`, { category });
  }

  getEventCategories(requestObject?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-event-categories`, { requestObject });
  }

  deleteEventCategory(category?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete-event-category`, { category });
  }
}
