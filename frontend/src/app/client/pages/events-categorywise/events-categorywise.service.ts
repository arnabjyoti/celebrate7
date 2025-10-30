import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsCategorywiseService {

  constructor(private http: HttpClient) { }

  getEventsByCategory(requestObject?: any): Observable<any> {
      return this.http.post(`${environment.BASE_URL}/api/get-events-by-category`, { requestObject });
  }
}
