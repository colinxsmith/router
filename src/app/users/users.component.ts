import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from './user.service';
import { User } from './User';
import * as d3 from 'd3';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

  users: User[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService
      .getUsers()
      .subscribe((data: User[]) => {
        this.users = data;
        this.users.sort((d1, d2) => {
          if (d2.movies.valueOf() > d1.movies.valueOf()) {
            return 1;
          } else if (d1.movies.valueOf() === d2.movies.valueOf()) {
            return 0;
          } else {
            return -1;
          }
        });
        const base = d3.select('app-users').append('svg')
          .attr('width', 500)
          .attr('height', 500);
        base.selectAll('inner').data(this.users).enter().append('text')
          .attr('x', 0)
          .attr('y', 0)
          .attr('transform', (d, i) => `translate(${20},${i * 30 + 30})`)
          .text((d) => `${d.id} ${d.movies.valueOf()} ${d.name}`)
          .attr('class', 'users');
      });
  }

}
