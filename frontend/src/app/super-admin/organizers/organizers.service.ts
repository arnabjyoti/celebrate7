import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class OrganizersService {
  constructor(private http: HttpClient) {}
  upsertOrganizer(organizer?: any): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/upsert-organizer`, { organizer });
  }

  getOrganizers(requestObject?: any): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/get-organizers`, { requestObject });
  }

  deleteOrganizer(organizer?: any): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/delete-organizer`, { organizer });
  }
}
