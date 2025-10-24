import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
// import {  Http, Headers, RequestOptions, Response } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public headers: any;
  private tokenKey = 'accessToken';
  constructor(
	private toastr: ToastrService,  
	private http: HttpClient) {
    this.getHttpHeader((h: any) => {
      this.headers = h;
    });
   }

   getHttpHeader = (callback: any) => {
    let headers = new Headers();//new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'Test key');
    headers.append('Access-Control-Allow-Origin', '*');
    return callback && callback(headers);
  }
}
