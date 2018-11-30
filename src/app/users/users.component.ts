import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from './user.service';
import * as d3 from 'd3';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

  users: any[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService
      .getUsers()
      .subscribe((data: any[]) => {
        this.users = data;
        this.users.sort((d1, d2) => {
          if (+d2.movies > +d1.movies) {
            return 1;
          } else if (+d1.movies === +d2.movies) {
            return 0;
          } else {
            return -1;
          }
        });
        const nDat = this.users.length;
        const base = d3.select('app-users').append('svg')
          .attr('width', 500)
          .attr('height', (nDat + 2) * 20);
        base.append('text')
          .attr('x', 5)
          .attr('y', 25)
          .attr('transform', `translate(${10},${0})`)
          .text(() => {
            let back = '';
            Object.keys(this.users[0]).forEach((k) => back += `${k} `);
            return back;
          })
          .attr('class', 'users');
        base.append('rect')
          .attr('class', 'users')
          .attr('width', 490)
          .attr('height', 24)
          .attr('x', 5)
          .attr('y', 3);
        base.selectAll('inner').data(this.users).enter().append('text')
          .attr('x', 5)
          .attr('y', 52)
          .attr('transform', (d, i) => `translate(${10},${i * 20})`)
          .text((d) => {
            let back = '';
            Object.keys(d).forEach((k) => back += `${d[k]} `);
            return back;
          })
          .attr('class', 'users');
        base.append('rect')
          .attr('class', 'users')
          .attr('width', 490)
          .attr('height', nDat * 21)
          .attr('x', 5)
          .attr('y', 32);
      });
  }

}
