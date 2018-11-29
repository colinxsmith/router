import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }
  url = 'http://localhost:4023';
  getUsers() {
    console.log('here');
    return this
            .http
            .get(`${this.url}/results`);
        }
}
