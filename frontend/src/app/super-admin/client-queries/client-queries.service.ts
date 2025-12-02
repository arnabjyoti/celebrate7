import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientQueriesService {
constructor(private http: HttpClient) {}
  getAllQueries(requestObject?: any): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-all-queries`, { requestObject });
  }

  deleteQuery(query?: any): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/delete-query`, { query: query });
  }
}
