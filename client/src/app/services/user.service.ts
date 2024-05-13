
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError  } from 'rxjs/operators';
import { GLOBAL } from './global';
import { User } from '../models/user';


@Injectable()
export class UserService {
  public url!: string;
  constructor(private http: HttpClient) {
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
          localStorage.setItem('token', response.token);
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
