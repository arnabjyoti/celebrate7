import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminProfileService {

  constructor(private http: HttpClient) { }

  getProfileInfo(requestObject?: any): Observable<any> {
        return this.http.post(`${environment.BASE_URL}/api/get-profile-info`, { requestObject });
    }
}
