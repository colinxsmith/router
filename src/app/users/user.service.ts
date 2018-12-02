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
      .post<{name: String, id: number, movies: number}>(`${this.url}/results`, {id: 8, name: 'Colin', movies: 0}, options);
  }
  putResult() {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this
      .http
      .put<{name: String, id: number, movies: number}>(`${this.url}/results/8`, {id: 8, name: 'Colin', movies: 200}, options);
  }
}
