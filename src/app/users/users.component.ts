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

  displayData: any[];
  getKey = 'radarData';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.postResult().subscribe(res => {
      console.log(res);
    },
      err => {
        console.log('Error occured');
      });
    this.userService
      .getUsers(this.getKey)
      .subscribe((data: any[]) => {
        if (this.getKey === 'results') {
          this.displayData = data;
          this.displayData.sort((d1, d2) => {
            if (+d2.movies > +d1.movies) {
              return 1;
            } else if (+d1.movies === +d2.movies) {
              return 0;
            } else {
              return -1;
            }
          });
          this.simpleDisplay();
        } else if (this.getKey === 'radarData') {
          data.forEach((d) => {
            this.displayData = d;
            this.displayData.sort((d1, d2) => {
              if (+d2.value > +d1.value) {
                return 1;
              } else if (+d1.value === +d2.value) {
                return 0;
              } else {
                return -1;
              }
            });
            this.simpleDisplay();
          });
        }
      });
  }

  simpleDisplay() {
    const nDat = this.displayData.length,
      base = d3.select('app-users').append('svg')
        .attr('width', 500)
        .attr('height', (nDat + 2) * 21);
    base.append('text')
      .attr('x', 5)
      .attr('y', 23)
      .attr('transform', `translate(${10},${0})`)
      .text(() => {
        let back = '';
        Object.keys(this.displayData[0]).forEach((k) => back += `${k} `);
        return back;
      })
      .attr('class', 'users');
    base.append('rect')
      .attr('class', 'users')
      .attr('width', 490)
      .attr('height', 24)
      .attr('x', 5)
      .attr('y', 3);
    base.selectAll('inner').data(this.displayData).enter().append('text')
      .attr('x', 5)
      .attr('y', 54)
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
  }
}
