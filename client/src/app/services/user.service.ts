import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable()
export class UserService {
  public identity: any;
  public token: any;
  public url!: string;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.url = GLOBAL.url;
  }

  signup(user_to_login: User, gethash: boolean | undefined = undefined): Observable<any> {
    user_to_login.gethash = gethash;
    const params = JSON.stringify(user_to_login);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url + 'login', params, { headers: headers }).pipe(
      map((response: any) => {
        if (response.token) {
          // Guardar el token en algún lugar (por ejemplo, localStorage)
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
          }
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  register(user_to_register: any){
    const params = JSON.stringify(user_to_register);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url + 'register', params, { headers: headers }).pipe(
      map((response: any) => {
        if (response.token) {
          // Guardar el token en algún lugar (por ejemplo, localStorage)
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
          }
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  getIdentity() {
    let identity;
    if (isPlatformBrowser(this.platformId)) {
      identity = localStorage.getItem('identity');
      if (identity) {
        this.identity = JSON.parse(identity);
      } else {
        this.identity = null;
      }
    }
    return this.identity;
  }

  getToken() {
    let token;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
      if (token) {
        this.token = token;
      } else {
        this.token = null;
      }
    }
    return this.token;
  }
}