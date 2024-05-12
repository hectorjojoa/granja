
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { User } from '../models/user';


@Injectable()
export class UserService {
  public url!: string;
  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  
  
  signup(user_to_login: User, gethash = null): Observable<any> {
    if (gethash == null) {
      user_to_login.gethash = gethash;
    }
    let json = JSON.stringify(user_to_login);
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url + 'login', params, { headers: headers })
      .pipe(map(res => res));
  }
}
