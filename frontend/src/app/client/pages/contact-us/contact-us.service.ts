import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
constructor(private http: HttpClient) {}
  saveClientQuery(contactForm?: any): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/api/save-client-query`, { contactForm: contactForm });
  }
}
