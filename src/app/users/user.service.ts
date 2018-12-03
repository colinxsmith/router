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
      .get<any[]>(`${this.url}/${key}`);
  }
  postResult() {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this
      .http
      .post<{ name: String, id: number, movies: number }>(`${this.url}/results`, { id: 7, name: 'Colin', movies: 0 }, options);
  }
  putResult(key = 'results', id = 7) {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this
      .http // Can't change the id here.... the id:8 is ignored
      .put<{
        name: String, id: number,
        movies: number
      }>(`${this.url}/${key}/${id}`, { id: 8, name: 'Colin', movies: Math.round(Math.random() * 200) }, options);
  }
}
