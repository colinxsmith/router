import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }
  url = 'http://localhost:4023';
  getUsers(key = 'results') {
    console.log('here');
    return this
      .http
      .get(`${this.url}/${key}`);
  }
  postResult() {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this
      .http
      .post(`${this.url}/results`, { name: 'Colin', id: 8, movies: 0}, options);
  }
}
