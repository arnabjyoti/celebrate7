import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventCategoriesService {
  constructor(private http: HttpClient) {}
  upsertEventCategory(category?: any): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/upsert-event-category`, { category });
  }

  getEventCategories(requestObject?: any): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-event-categories`, { requestObject });
  }

  deleteEventCategory(category?: any): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/delete-event-category`, { category });
  }
}
