import { Component, ViewEncapsulation, OnChanges, SimpleChanges, Input } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserService } from './user.service';
import * as d3 from 'd3';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnChanges {
  displayData: any;
  sendOptLabel = 'SEND';
  resetOptLabel = 'RESET';
  updateLabel = 'MAKE POINTED';
  dataChangedDueToAnotherSessionOptimising = false;
  getKey = '';
  plotLab: string[] = [];
  plotLabels = { 'Low Risk': 1, 'High Risk': 2, 'Low Medium Risk': 3, 'High Medium Risk': 4 };
  choose2 = [0, 0];
  dbKeyData = ['radarData', 'OPT', 'factorX'].reverse();
  tooltip = d3.select('app-users').append('g').attr('class', 'toolTip');
  optType: string[];
  @Input() getType = '';
  @Input() nStocks: number;
  @Input() factorConstraintChange: number[];
  constructor(private userService: UserService, private appComponent: AppComponent) {
    this.optType = this.appComponent.optType;
  }
  sendOpt() {
    console.log(this.factorConstraintChange);
    this.changeLs(this.getType, this.updateLabel !== 'MAKE POINTED');
  }
  resetOpt() {
    this.factorConstraintChange = [];
    console.log(this.factorConstraintChange);
    this.changeLs(this.getType, this.updateLabel !== 'MAKE POINTED');
  }
  ngOnChanges(changed: SimpleChanges) {
    console.log('ngOnChanges '); console.log(changed);
    for (const piggy in changed) {
      if (piggy === 'getType') {
        if (changed.getType.firstChange) {
          this.getType = this.optType[0];
          this.plotLab = Object.keys(this.plotLabels);
          this.getKey = this.dbKeyData[0];
        }
      }
    }
    this.changeLs(this.getType, this.updateLabel !== 'MAKE POINTED');
    console.log(changed);
  }
  squareArc = (parm: { outerRadius: number, innerRadius: number, startAngle: number, endAngle: number }) => {
    parm.startAngle -= Math.PI * 0.5;
    parm.endAngle -= Math.PI * 0.5;
    const makeZ = (x: number) => Math.abs(x) < 1e-8 ? 0 : x;
    const seg1 = { xx1: 0, xx2: 0, yy1: 0, yy2: 0 };
    const seg2 = { xx1: 0, xx2: 0, yy1: 0, yy2: 0, face: 0 };
    if (parm.innerRadius === 0) {
      parm.innerRadius = 1e-7;
    }
    if (parm.outerRadius === 0) {
      parm.outerRadius = 1e-7;
    }
    seg1.xx1 = parm.innerRadius * Math.cos(parm.startAngle);
    seg1.yy1 = parm.innerRadius * Math.sin(parm.startAngle);
    if (Math.abs(seg1.xx1) > Math.abs(seg1.yy1)) {
      seg1.yy1 *= Math.abs(parm.innerRadius / seg1.xx1);
      seg1.xx1 = seg1.xx1 < 0 ? -parm.innerRadius : parm.innerRadius;
    } else {
      seg1.xx1 *= Math.abs(parm.innerRadius / seg1.yy1);
      seg1.yy1 = seg1.yy1 < 0 ? -parm.innerRadius : parm.innerRadius;
    }
    seg1.xx2 = parm.outerRadius * Math.cos(parm.startAngle);
    seg1.yy2 = parm.outerRadius * Math.sin(parm.startAngle);
    if (Math.abs(seg1.xx2) > Math.abs(seg1.yy2)) {
      seg1.yy2 *= Math.abs(parm.outerRadius / seg1.xx2);
      seg1.xx2 = seg1.xx2 < 0 ? -parm.outerRadius : parm.outerRadius;
    } else {
      seg1.xx2 *= Math.abs(parm.outerRadius / seg1.yy2);
      seg1.yy2 = seg1.yy2 < 0 ? -parm.outerRadius : parm.outerRadius;
    }
    seg2.xx1 = parm.innerRadius * Math.cos(parm.endAngle);
    seg2.yy1 = parm.innerRadius * Math.sin(parm.endAngle);
    if (Math.abs(seg2.xx1) > Math.abs(seg2.yy1)) {
      seg2.yy1 *= Math.abs(parm.innerRadius / seg2.xx1);
      seg2.xx1 = seg2.xx1 < 0 ? -parm.innerRadius : parm.innerRadius;
    } else {
      seg2.xx1 *= Math.abs(parm.innerRadius / seg2.yy1);
      seg2.yy1 = seg2.yy1 < 0 ? -parm.innerRadius : parm.innerRadius;
    }
    seg2.xx2 = parm.outerRadius * Math.cos(parm.endAngle);
    seg2.yy2 = parm.outerRadius * Math.sin(parm.endAngle);
    if (Math.abs(seg2.xx2) > Math.abs(seg2.yy2)) {
      seg2.yy2 *= Math.abs(parm.outerRadius / seg2.xx2);
      seg2.xx2 = seg2.xx2 < 0 ? -parm.outerRadius : parm.outerRadius;
    } else {
      seg2.xx2 *= Math.abs(parm.outerRadius / seg2.yy2);
      seg2.yy2 = seg2.yy2 < 0 ? -parm.outerRadius : parm.outerRadius;
    }
    if (seg1.xx1 === -parm.innerRadius && seg2.xx1 === -parm.innerRadius) {
      // both left side
      if (seg2.yy1 <= seg1.yy1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.yy1 === -parm.innerRadius && seg2.yy1 === -parm.innerRadius) {
      // both top side
      if (seg2.xx1 >= seg1.xx1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.xx1 === parm.innerRadius && seg2.xx1 === parm.innerRadius) {
      // both right side
      if (seg2.yy1 >= seg1.yy1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.yy1 === parm.innerRadius && seg2.yy1 === parm.innerRadius) {
      // both bottom side
      if (seg2.xx1 <= seg1.xx1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.xx1 === -parm.innerRadius && seg2.yy1 === -parm.innerRadius) {
      // left to top
      seg2.face = 1;
    } else if (seg1.xx1 === -parm.innerRadius && seg2.xx1 === parm.innerRadius) {
      // left to right
      seg2.face = 2;
    } else if (seg1.xx1 === -parm.innerRadius && seg2.yy1 === parm.innerRadius) {
      // left to bottom
      seg2.face = 3;
    } else if (seg1.yy1 === -parm.innerRadius && seg2.xx1 === parm.innerRadius) {
      // top to right
      seg2.face = 1;
    } else if (seg1.yy1 === -parm.innerRadius && seg2.yy1 === parm.innerRadius) {
      // top to bottom
      seg2.face = 2;
    } else if (seg1.yy1 === -parm.innerRadius && seg2.xx1 === -parm.innerRadius) {
      // top to left
      seg2.face = 3;
    } else if (seg1.xx1 === parm.innerRadius && seg2.yy1 === parm.innerRadius) {
      // right to bottom
      seg2.face = 1;
    } else if (seg1.xx1 === parm.innerRadius && seg2.xx1 === -parm.innerRadius) {
      // right to left
      seg2.face = 2;
    } else if (seg1.xx1 === parm.innerRadius && seg2.yy1 === -parm.innerRadius) {
      // right to top
      seg2.face = 3;
    } else if (seg1.yy1 === parm.innerRadius && seg2.xx1 === -parm.innerRadius) {
      // bottom to left
      seg2.face = 1;
    } else if (seg1.yy1 === parm.innerRadius && seg2.yy1 === -parm.innerRadius) {
      // bottom to top
      seg2.face = 2;
    } else if (seg1.yy1 === parm.innerRadius && seg2.xx1 === parm.innerRadius) {
      // bottom to right
      seg2.face = 3;
    }
    let quadR = 'M ' + seg1.xx2 + ' ' + seg1.yy2 + ' L ' + seg1.xx1 + ' ' + seg1.yy1;
    seg1.xx1 = makeZ(seg1.xx1);
    seg1.yy1 = makeZ(seg1.yy1);
    seg1.xx2 = makeZ(seg1.xx2);
    seg1.yy2 = makeZ(seg1.yy2);
    seg2.xx1 = makeZ(seg2.xx1);
    seg2.yy1 = makeZ(seg2.yy1);
    seg2.xx2 = makeZ(seg2.xx2);
    seg2.yy2 = makeZ(seg2.yy2);
    if (seg2.face === 0) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
      }
    } else if (seg2.face === 1) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
      }
    } else if (seg2.face === 2) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
      }
    } else if (seg2.face === 3) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
      }
    } else if (seg2.face === 4) {
      if (seg1.xx1 === -parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + -parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.xx1 === parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + seg2.yy1;
        quadR += 'L ' + parm.outerRadius + ' ' + seg2.yy2;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
      } else if (seg1.yy1 === -parm.innerRadius) {
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + -parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
      } else if (seg1.yy1 === parm.innerRadius) {
        quadR += 'L ' + -parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + -parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + -parm.innerRadius;
        quadR += 'L ' + parm.innerRadius + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx1 + ' ' + parm.innerRadius;
        quadR += 'L ' + seg2.xx2 + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + parm.outerRadius;
        quadR += 'L ' + parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + -parm.outerRadius;
        quadR += 'L ' + -parm.outerRadius + ' ' + parm.outerRadius;
      }
    }
    quadR += 'Z'; // Closed curve
    return quadR;
  }

  pickOutNonZeroValues(data: { alpha: number, axis: string, value: number, id: number }[][]) {
    data = this.choose2[0] === this.choose2[1] ? data : [data[this.choose2[0]], data[this.choose2[1]]];
    const displayData: { alpha: number, axis: string, value: number, id: number }[][] = [];
    const maxFac: number[] = Array(data[0].length);
    const minFac: number[] = Array(data[0].length);
    const aim = 12;
    let base = 1e-2;
    for (let i = 0; i < data[0].length; ++i) {
      maxFac[i] = -1e9;
      minFac[i] = 1e9;
    }
    data.forEach((dad) => {
      dad.forEach((vals, i) => {
        minFac[i] = Math.min(minFac[i], vals.value);
        maxFac[i] = Math.max(maxFac[i], vals.value);
      });
    });
    data.forEach((dad) => {
      const newDat: { alpha: number, axis: string, value: number, id: number }[] = [];
      let numberOk = 0;
      while (numberOk < aim && base > 1e-5) {
        numberOk = 0;
        dad.forEach((vals, i) => {
          if (!(minFac[i] > -base && maxFac[i] < base)) {
            numberOk++;
          }
        });
        if (numberOk < aim && base > 1e-5) {
          base /= 2;
        }
      }
      dad.forEach((vals, i) => {
        if (!(minFac[i] > -base && maxFac[i] < base)) {
          newDat.push(vals);
        }
      });
      displayData.push(newDat);
    });
    return displayData;
  }
  choosePlot1(dd: string) {
    this.choose2[0] = this.plotLabels[dd] - 1;
    d3.select('app-users').selectAll('svg').remove();
    this.chooseData(this.getKey, this.updateLabel !== 'MAKE POINTED');
  }
  choosePlot2(dd: string) {
    this.choose2[1] = this.plotLabels[dd] - 1;
    d3.select('app-users').selectAll('svg').remove();
    this.chooseData(this.getKey, this.updateLabel !== 'MAKE POINTED');
  }
  changeDat() {
    d3.select('app-users').selectAll('svg').remove();
    const pointed = this.updateLabel === 'MAKE POINTED';
    this.chooseData(this.getKey, pointed);
    this.updateLabel = pointed ? 'MAKE ROUND' : 'MAKE POINTED';
  }
  changeLs(type: string, pointed = false) {
    // this.getType = type;
    console.log('Data changed is ' + this.dataChangedDueToAnotherSessionOptimising);
    d3.select('app-users').selectAll('.main').remove();
    if (this.dataChangedDueToAnotherSessionOptimising) {
      this.chooseData(this.getKey, pointed);
    } else {
      // Only optimise to get new OPT and radarData if changes were made to getType and nStocks here.
      this.userService.postType(this.nStocks, this.getType, this.factorConstraintChange).subscribe(res => {
        console.log(res);
        this.chooseData(this.getKey, pointed);
      });
    }
  }
  chooseData(dd: string, joinLinear = false) {
    d3.select('app-users').selectAll('svg').remove();

    this.getKey = dd;
    /*    this.userService.postResult().subscribe(res => {
          console.log(res);
        },
          () => {
            console.log('Error in post, try put');
            this.userService.putResult().subscribe(res => {
              console.log(res);
            },
              () => {
                console.log('Error in put');
              });
          });*/

    this.userService
      .getData('')
      .pipe(map(da2 => {
        this.dataChangedDueToAnotherSessionOptimising = !(this.nStocks === +da2.nstocks && this.getType === da2.type);
        if (this.dataChangedDueToAnotherSessionOptimising) {
          this.appComponent.changeStocks(+da2.nstocks);
          this.appComponent.changeType(da2.type);
          this.appComponent.changeWants(this.factorConstraintChange);
        }
        this.displayData = da2[this.getKey];
        return da2;
      }))
      .subscribe(data => {
        if (this.getKey === 'results') {
          this.displayData.sort((d1, d2) => {
            if (+d2.movies > +d1.movies) {
              return 1;
            } else if (+d1.movies === +d2.movies) {
              return 0;
            } else {
              return -1;
            }
          });
          this.simpleDisplay(this.displayData);
        } else if (this.getKey === 'radarData') {
          const displayData = this.pickOutNonZeroValues(this.displayData);
          this.plotLab = Object.keys(this.plotLabels);
          if (this.displayData.length < 4) {
            this.plotLab.forEach((d, i) => {
              if (i >= this.displayData.length) {
                this.plotLab[i] = undefined;
              }
            });
          }
          const margin = { top: 40, right: 40, bottom: 40, left: 40 }, ww = 400, hh = 400,
            width = ww - margin.left - margin.right,
            height = hh - margin.top - margin.bottom,
            radarBlobColour = d3.scaleOrdinal<number, string>().range(['rgb(255,50,50)', 'rgb(50,255,50)',
              'rgb(255,255,50)', 'rgb(50,255,255)']),
            radarChartOptions = {
              w: width, h: height, margin: margin, maxValue: 0,
              levels: 3, roundStrokes: !joinLinear, colour: radarBlobColour
            };
          this.RadarChart('app-users', displayData, radarChartOptions);
          displayData.forEach((ddd, id) => {
            this.stockbars(ddd, id, ww, hh, 2000, 'Factor Exposure', 'Factor');
            this.simpleDisplay(ddd);
          });
        } else if (this.getKey === 'OPT') {
          this.plotLab = Object.keys(this.plotLabels);
          if (this.displayData.length < 4) {
            this.plotLab.forEach((d, i) => {
              if (i >= this.displayData.length) {
                this.plotLab[i] = undefined;
              }
            });
          }
          const margin = { top: 40, right: 40, bottom: 40, left: 40 }, ww = 400, hh = 400,
            width = ww - margin.left - margin.right,
            height = hh - margin.top - margin.bottom,
            radarBlobColour = d3.scaleOrdinal<number, string>().range(['rgb(255,50,50)', 'rgb(50,255,50)',
              'rgb(255,255,50)', 'rgb(50,255,255)']),
            radarChartOptions = {
              w: width, h: height, margin: margin, maxValue: 0,
              levels: 4, roundStrokes: !joinLinear, colour: radarBlobColour
            };

          let data1: { alpha: number, axis: string, value: number, id: number }[][]
            = this.displayData[0].portfolio !== undefined ? this.displayData.map(ddd => ddd.portfolio) : this.displayData;
          if (data1[0][0].alpha !== undefined) {
            data1.forEach((ddd) => {
              ddd.sort((d1, d2) => {
                if (d2.alpha < d1.alpha) { // Want high alpha at end of list
                  return 1;
                } else if (d1.alpha === d2.alpha) {
                  return 0;
                } else {
                  return -1;
                }
              });
            });
          }
          data1 = this.pickOutNonZeroValues(data1);
          this.RadarChart('app-users', data1, radarChartOptions);
          data1.forEach((ddd, i: number) => {
            const idisp = data1.length === 4 || this.getType === 'factor' ? i : this.choose2[i];
            this.stockbars(ddd, i, ww, hh, 2000, 'Weights', 'Assets');
            this.simpleDisplay(ddd);
            d3.select('app-users').append('svg').attr('width', 600).attr('height', 50).append('g').append('text')
              .attr('transform', 'translate(0,30)').attr('class', 'users')
              .text(() => `Risk: ${this.displayData[idisp].risk}, Return: ${this.displayData[idisp].return},
                gamma: ${this.displayData[idisp].gamma}`);
          });
        } else if (this.getKey === 'newData') {
          if (this.displayData.length !== undefined) {
            this.simpleDisplay(this.displayData);
          } else {
            this.simpleDisplay([this.displayData]);
          }
        } else if (this.getKey === 'factorX') {
          this.fiveArcs();
          const datahere: { risk: number, return: number, back: string }[] = this.displayData;
          const svg = d3.select('app-users').append('svg').attr('width', 950).attr('height', 100);
          svg.selectAll('.riskret').data(datahere).enter()
            .append('text')
            .attr('transform', (d, i) => `translate(0,${20 * (i + 1)})`)
            .attr('class', 'rmessage').attr('x', 0).attr('y', 0)
            .text(d => `Risk: ${d.risk} Return: ${d.return} Return status: ${d.back}`)
            .on('mouseover', (d, ii, jj) => d3.select(jj[ii]).classed('over', true))
            .on('mouseout', (d, ii, jj) => d3.select(jj[ii]).classed('over', false));
          const FC: number[] = this.displayData[0].FC;
          const factorsOff = this.displayData.length === 2 ? this.displayData[1].factors : this.displayData[0].factors;
          const svgFactorX = this.factorX(factorsOff, 200);
          const margin = { top: 40, right: 40, bottom: 40, left: 40 }, ww = 400, hh = 400,
            width = ww - margin.left - margin.right,
            height = hh - margin.top - margin.bottom,
            radarBlobColour = d3.scaleOrdinal<number, string>().range(['rgb(255,50,50)', 'rgb(50,255,50)',
              'rgb(255,255,50)', 'rgb(50,255,255)']),
            options = {
              w: width, h: height, margin: margin, maxValue: 0,
              levels: 4, roundStrokes: !joinLinear, colour: radarBlobColour
            };
          if (this.displayData.length === 2) {
            svgFactorX.remove();
          }
          this.RadarChart('app-users', this.pickOutNonZeroValues(this.displayData.map(d => d.factors)), options);
          this.correlationMatrix(FC, this.displayData[0].factors.map(d => d.axis), 700);
          this.displayData.forEach((DATA, ii: number) => {
            const usedweight = DATA.w;
            const factorBetas = DATA.FL;
            this.matrixFLorFX(ii, usedweight, factorBetas, this.displayData[0].factors.map(d => d.axis), 0, 700);
            const factorExp: number[] = [];
            factorBetas.forEach((d, i) => {
              const iw = i % usedweight.length;
              factorExp.push(d * usedweight[iw].w);
            });
            this.matrixFLorFX(ii, usedweight, factorExp, this.displayData[0].factors.map(d => d.axis), 1);
          });
          this.fiveCircles();
        }
        d3.select('app-users').selectAll('text.users')
          .on('mouseover', (d, ii, jj) => {
            const here = d3.select(jj[ii]);
            if (here.attr('lineindex') !== null) {
              const test = d3.select('app-users').selectAll('text.users');
              test.each((kk, iii, jjj) => {
                const kkk = d3.select(jjj[iii]);
                if (kkk.attr('lineindex') === here.attr('lineindex')) {
                  kkk.classed('over', true);
                }
              });
            } else {
              here.classed('over', true);
            }
          })
          .on('mouseout', (d, ii, jj) => {
            const here = d3.select(jj[ii]);
            if (here.attr('lineindex') !== null) {
              const test = d3.select('app-users').selectAll('text.users');
              test.each((kk, iii, jjj) => {
                const kkk = d3.select(jjj[iii]);
                if (kkk.attr('lineindex') === here.attr('lineindex')) {
                  kkk.classed('over', false);
                }
              });
            } else {
              here.classed('over', false);
            }
          });
      }, res => {
        console.log(res);
      });

  }
  matrixFLorFX(dataIndex: number, weights: { w: number, name: string }[],
    factorBetas: number[], fNames: string[], totals = 0, w = 960, h = 960, id = 'app-users') {
    const nRow = weights.length + totals, nfac = factorBetas.length / weights.length, nCol = nfac + totals,
      margin = { top: 250, right: 10, bottom: 10, left: 100 };
    let width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;
    const spacer = 10, rotateAngle = -45,
      squareSide = Math.min(width / nCol, height / nRow) - spacer, Side = squareSide + spacer;
    height = (squareSide + spacer) * nRow;
    h = height + margin.top + margin.bottom;
    width = (squareSide + spacer) * nCol;
    w = width + margin.left + margin.right;
    const totalsCol: number[] = Array(nfac);
    for (let i = 0; i < totalsCol.length; ++i) {
      totalsCol[i] = 0;
    }
    let sumEx = 0;
    factorBetas.forEach((d, i) => {
      totalsCol[Math.floor(i / weights.length)] += d;
      sumEx += d;
    });
    const svgBase = d3.select(id).attr('class', 'main').append('g').append('svg')
      .attr('width', w).attr('height', h),
      svg = svgBase.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`),
      radScale = d3.scaleLinear().range([0, Side / 2]).domain([d3.min(factorBetas.map(d => Math.abs(d))),
      d3.max(factorBetas.map(d => Math.abs(d)))]);
    svg.append('rect')
      .attr('class', 'rim')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height);
    svg.selectAll('.factorLabels').select('g').data(fNames).enter()
      .append('text')
      .attr('transform', (d, i) => `translate(${i * Side + Side / 2}, ${-spacer}),rotate(-75)`)
      .attr('class', 'factorLabels')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .text(d => d)
      .call(this.wrapFunction, margin.top, 1.01)
      ;
    svg.selectAll('.stockLabels').select('g').data(weights.map(d => d.name)).enter()
      .append('text')
      .attr('class', 'stockLabels').attr('x', 0)
      .attr('transform', (d, i) => `translate(${-spacer},${i * Side + (d.indexOf(' ') > -1 ? Side / 4 : Side / 2)})`)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .text(d => d)
      .call(this.wrapFunction, margin.left, 1.01)
      ;
    svg.selectAll('.fbetas').select('g').data(factorBetas).enter()
      .append('circle')
      .attr('class', d => d >= 0 ? 'fbetas pos' : 'fbetas neg')
      .attr('transform', (d, i) => `translate(${(Math.floor(i / weights.length)) * Side},${Math.floor(i % weights.length) * Side})`)
      .attr('cx', Side / 2)
      .attr('cy', Side / 2)
      .attr('r', d => d === 0 ? 0 : radScale(Math.abs(d)))
      .on('mousemove', (d, i) => {
        this.tooltip.style('left', d3.event.pageX - 50 + 'px')
          .style('top', d3.event.pageY - 70 + 'px')
          .style('display', 'inline-block')
          .html(`<i class='fa fa-gears leafy'></i>${totals === 1 ? 'Exposure' : '&beta;'} of
          ${weights[Math.floor(i % weights.length)].name}<br> to
          ${fNames[Math.floor(i / weights.length)]}:<br>${d3.format('0.4f')(d)}`);
      })
      .on('mouseout', () => this.tooltip.style('display', 'none'))
      .transition().duration(2000).attrTween('transform', (d, i) => (t) => {
        const x = Math.floor(i / weights.length) * Side;
        const y = Math.floor(i % weights.length) * Side;
        return `translate(${(Math.sin(5 * (1 - t)) * y + t * x)},
      ${(Math.sin(3 * (1 - t)) * x + t * y)}), rotate(${(1 - t) * 45 + t * 360})`;
      })
      ;
    if (totals) {
      svg.append('text')
        .attr('class', 'stockLabels').attr('x', 0)
        .attr('transform', (d, i) => `translate(${-spacer},${Side * weights.length + Side / 2})`)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .text(d => 'Totals')
        .call(this.wrapFunction, margin.left, 1.01)
        ;
      svg.selectAll('.totals').select('g').data(totalsCol).enter()
        .append('rect')
        .attr('class', d => d >= 0 ? 'totals pos' : 'totals neg')
        .attr('transform', (d, i) => `translate(${i * Side},${Math.floor(weights.length) * Side})`)
        .attr('picId', dataIndex)
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', Side)
        .attr('width', Side)
        .on('mousemove', (d, i) => {
          this.tooltip.style('left', d3.event.pageX - 50 + 'px')
            .style('top', d3.event.pageY - 70 + 'px')
            .style('display', 'inline-block')
            .html(`<i class='fa fa-gears leafy'></i>Total: ${fNames[i]}<br>${d3.format('0.4f')(d)}`);
        })
        .on('mouseout', () => this.tooltip.style('display', 'none'))
        .transition().duration(2000).attrTween('transform', (d, i) => (t) =>
          `translate(${i * Side},${t * Math.floor(weights.length) * Side})`)
        ;
      svg.append('rect')
        .attr('class', 'fbetas')
        .attr('class', sumEx >= 0 ? 'total pos' : 'total neg')
        .attr('transform', `translate(${nfac * Side},${Math.floor(weights.length) * Side})`)
        .attr('picId', dataIndex)
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', Side)
        .attr('width', Side)
        .on('mousemove', (d, i) => {
          this.tooltip.style('left', d3.event.pageX - 50 + 'px')
            .style('top', d3.event.pageY - 70 + 'px')
            .style('display', 'inline-block')
            .html(`<i class='fa fa-gears leafy'></i>Total: ${d3.format('0.4f')(sumEx)}`);
        })
        .on('mouseout', () => this.tooltip.style('display', 'none'))
        .transition().duration(2000).attrTween('transform', () => (t) =>
          `translate(${t * nfac * Side},${t * Math.floor(weights.length) * Side})`)
        ;
    }
    svg.selectAll('.fbetas').select('g').data(factorBetas).enter()
      .append('text')
      .attr('class', 'fbetas')
      .attr('transform', (d, i) => `translate(${(Math.floor(i / weights.length)) * Side},
      ${Math.floor(i % weights.length) * Side})`)
      .attr('x', Side / 2)
      .attr('y', (d, i, j) => {
        const here = d3.select(j[i]);
        const font = +here.style('font-size').replace('px', '') * w / h;
        here.style('font-size', font + 'px');
        return Side / 2 + font / 4;
      })
      .text(d => d === 0 ? '0' : d3.format('0.2f')(d))
      .on('mousemove', (d, i) => {
        this.tooltip.style('left', d3.event.pageX - 50 + 'px')
          .style('top', d3.event.pageY - 70 + 'px')
          .style('display', 'inline-block')
          .html(`<i class='fa fa-gears leafy'></i>${totals === 1 ? 'Exposure' : '&beta;'} of
          ${weights[Math.floor(i % weights.length)].name}<br> to
          ${fNames[Math.floor(i / weights.length)]}:<br>${d3.format('0.4f')(d)}`);
      })
      .on('mouseout', () => this.tooltip.style('display', 'none'))
      ;
    if (totals) {
      svg.selectAll('.fbetas').select('g').data(totalsCol).enter()
        .append('text')
        .attr('class', 'fbetas')
        .attr('transform', (d, i) => `translate(${i * Side},
          ${Math.floor(weights.length) * Side})`)
        .attr('x', Side / 2)
        .attr('y', (d, i, j) => {
          const here = d3.select(j[i]);
          const font = +here.style('font-size').replace('px', '') * w / h;
          here.style('font-size', font + 'px');
          return Side / 2 + font / 4;
        })
        .text(d => d3.format('0.2f')(d))
        .on('mousemove', (d, i) => {
          this.tooltip.style('left', d3.event.pageX - 50 + 'px')
            .style('top', d3.event.pageY - 70 + 'px')
            .style('display', 'inline-block')
            .html(`<i class='fa fa-gears leafy'></i>Total: ${fNames[i]}<br>${d3.format('0.4f')(d)}`);
        })
        .on('mouseout', () => this.tooltip.style('display', 'none'))
        ;
      svg.append('text')
        .attr('class', 'fbetas')
        .attr('transform', `translate(${nfac * Side},${Math.floor(weights.length) * Side})`)
        .attr('x', Side / 2)
        .attr('y', (d, i, j) => {
          const here = d3.select(j[i]);
          const font = +here.style('font-size').replace('px', '') * w / h;
          here.style('font-size', font + 'px');
          return Side / 2 + font / 4;
        })
        .text(d3.format('0.2f')(sumEx))
        .on('mousemove', (d, i) => {
          this.tooltip.style('left', d3.event.pageX - 50 + 'px')
            .style('top', d3.event.pageY - 70 + 'px')
            .style('display', 'inline-block')
            .html(`<i class='fa fa-gears leafy'></i>Total: ${d3.format('0.4f')(sumEx)}`);
        })
        .on('mouseout', () => this.tooltip.style('display', 'none'))
        ;

    }
  }
  correlationMatrix(FC: number[], factorNames: string[], w = 1000, h = 1000, id = 'app-users') {
    const numFac = (Math.sqrt(1 + 8 * FC.length) - 1) / 2;
    const plotFC: { i: number, j: number, correlation: number }[] = [];
    const sdI: number[] = Array(factorNames.length);
    for (let i = 0, ij = 0; i < factorNames.length; ++i) {
      for (let j = 0; j <= i; ++j, ij++) {
        if (i === j) {
          sdI[i] = Math.sqrt(FC[ij]);
        }
      }
    }
    for (let i = 0, ij = 0; i < factorNames.length; ++i) {
      for (let j = 0; j <= i; ++j, ++ij) {
        if (i === j) {
          plotFC.push({ i: i, j: j, correlation: 1 });
        } else {
          plotFC.push({ i: i, j: j, correlation: FC[ij] / sdI[i] / sdI[j] });
        }
      }
    }
    const margin = { top: 90, right: 140, bottom: 10, left: 10 };
    let width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;
    const spacer = 10, rotateAngle = -45,
      squareSide = Math.min(width, height) / factorNames.length - spacer, Side = squareSide + spacer;
    width = (squareSide + spacer) * factorNames.length;
    height = (squareSide + spacer) * factorNames.length;
    w = width + margin.right + margin.left;
    h = height + margin.bottom + margin.top;
    const svgBase = d3.select(id).attr('class', 'main').append('g').append('svg')
      .attr('width', w).attr('height', h),
      svg = svgBase.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    svg.append('rect')
      .attr('class', 'rim')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height);
    svg.selectAll('.correlations').select('g').data(plotFC).enter()
      .append('path')
      .attr('class', d => `correlations ${d.correlation > 0 ? 'pos' : 'neg'}`)
      .attr('transform', d => `translate(${d.i * Side},${d.j * Side})`)
      .attr('d', d => d.i === d.j ? `M0 0l${Side} 0l0 ${Side}Z` : `M0 0l${Side} 0l0 ${Side}l${-Side} 0Z`)
      .on('mousemove', (d) => this.tooltip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px')
        .style('display', 'inline-block')
        .html(`<i class='fa fa-gears leafy'></i>${factorNames[d.i]}<br>${factorNames[d.j]}
        <br>correlation:${d3.format('0.4f')(d.correlation)}`))
      .on('mouseout', (d) => this.tooltip.style('display', 'none'))
      .transition().duration(2000).attrTween('transform', d => (t) =>
        `translate(${(Math.sin(5 * (1 - t)) * (d.j) + t * d.i) * Side},
        ${(Math.sin(3 * (1 - t)) * (d.i) + t * d.j) * Side}), rotate(${(1 - t) * 45 + t * 360})`)
      .style('fill-opacity', d => Math.sqrt(Math.abs(d.correlation)))
      ;
    svg.selectAll('.correlations').select('g').data(plotFC).enter()
      .append('text')
      .attr('class', 'correlations')
      .text(d => d.i !== d.j ? d3.format('0.3f')(d.correlation) : '')
      .attr('transform', d => `translate(${d.i * Side + squareSide / 2},${d.j * Side + squareSide / 2}),rotate(${rotateAngle})`)
      .attr('x', spacer / 2 + (-squareSide / 2) * (Math.cos(Math.PI / 180 * rotateAngle)))
      .attr('y', spacer / 2 + (-squareSide / 2 + width / factorNames.length / 4) * (Math.sin(Math.PI / 180 * rotateAngle)))
      .on('mousemove', (d) => this.tooltip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px')
        .style('display', 'inline-block')
        .html(`<i class='fa fa-gears leafy'></i>${factorNames[d.i]}<br>${factorNames[d.j]}
        <br>correlation:${d3.format('0.4f')(d.correlation)}`))
      .on('mouseout', (d) => this.tooltip.style('display', 'none'));
    svg.selectAll('.factorLabels').select('g').data(factorNames).enter()
      .append('text')
      .attr('transform', (d, i) => `translate(${i * Side + Side / 2}, ${-spacer}),rotate(-75)`)
      .attr('class', 'factorLabels')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .text(d => d)
      .call(this.wrapFunction, margin.top, 1.01)
      ;
    svg.selectAll('.stockLabels').select('g').data(factorNames).enter()
      .append('text')
      .attr('class', 'stockLabels').attr('x', 0)
      .attr('transform', (d, i) => `translate(${width + spacer},${i * Side})`)
      .attr('y', -5)
      .attr('dy', '0.3em')
      .style('text-anchor', 'start')
      .text(d => d)
      .call(this.wrapFunction, margin.left, 1.01)
      ;
  }
  fiveArcs(w = 960, h = 500, kevData = {
    id: 112,
    type: 'alertFlag',
    label: 'ALERTS',
    outlierStatus: '',
    chartType: 'MULTI',
    tooltip: '',
    monitorFlagCategory: [{
      id: 1,
      type: '0',
      name: 'Fail',
      value: 385,
      outlierStatusType: 'OLD Q',
      withKE: false
    }, {
      id: 2,
      type: '1',
      name: 'Warning',
      value: 1000,
      outlierStatusType: 'OLD Q',
      withKE: false
    }, {
      id: 3,
      type: '2',
      name: 'Pass',
      value: 28954,
      outlierStatusType: 'OLD Q',
      withKE: false
    }, {
      id: 4,
      type: '0',
      name: 'Fail',
      value: 2340,
      outlierStatusType: 'OLD P',
      withKE: false
    }, {
      id: 5,
      type: '1',
      name: 'Warning',
      value: 2000,
      outlierStatusType: 'OLD P',
      withKE: false
    }, {
      id: 6,
      type: '2',
      name: 'Pass',
      value: 28654,
      outlierStatusType: 'OLD P',
      withKE: false
    }, {
      id: 7,
      type: '0',
      name: 'Fail',
      value: 1000,
      outlierStatusType: 'DECAY',
      withKE: false
    }, {
      id: 8,
      type: '1',
      name: 'Warning',
      value: 3000,
      outlierStatusType: 'DECAY',
      withKE: false
    }, {
      id: 9,
      type: '2',
      name: 'Pass',
      value: 28554,
      outlierStatusType: 'DECAY',
      withKE: false
    }, {
      id: 10,
      type: '0',
      name: 'Fail',
      value: 2500,
      outlierStatusType: 'MISMATCH',
      withKE: false
    }, {
      id: 11,
      type: '1',
      name: 'Warning',
      value: 1549,
      outlierStatusType: 'MISMATCH',
      withKE: false
    }, {
      id: 12,
      type: '2',
      name: 'Pass',
      value: 28550,
      outlierStatusType: 'MISMATCH',
      withKE: false
    }, {
      id: 13,
      type: '0',
      name: 'Fail',
      value: 3009,
      outlierStatusType: 'NO P',
      withKE: false
    }, {
      id: 14,
      type: '1',
      name: 'Warning',
      value: 4545,
      outlierStatusType: 'NO P',
      withKE: false
    }, {
      id: 15,
      type: '2',
      name: 'Pass',
      value: 28200,
      outlierStatusType: 'NO P',
      withKE: false
    }
    ]
  }, id = 'app-users', click = (i: number, j: d3.BaseType[] | d3.ArrayLike<d3.BaseType>) => console.log('Object', j[i]),
    useSquare = true) {
    const Data: {
      id: number;
      type: string;
      name: string;
      value: number;
      outlierStatusType: string;
      withKE: boolean;
      total: number;
    }[] = [];
    kevData.monitorFlagCategory.forEach(d => {
      const p: any = d;
      p.total = 0;
      Data.push(p);
    });
    kevData.monitorFlagCategory.forEach(d => {
      const i = d.id - 1 + 2 - +d.type;
      Data[i].total += d.value;
    });
    Data.forEach(d => {
      const i = d.id - 1;
      if (+d.type !== 2) {
        Data[i].total = Data[i + 2 - +d.type].total;
      }
    });
    /* This is probably better
    kevData.monitorFlagCategory.forEach((d, j) => {
      Data[j + 2 - j % 3].total += d.value;
    });
    Data.forEach((d, j) => {
      if (j % 3 !== 2) {
        Data[j].total = Data[j + 2 - j % 3].total;
      }
    });
    */
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    let width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;
    const radiusL = Math.min(width, height) / 2, radiusS = radiusL / (1 + Math.sqrt(2)), extra = Math.PI * 0.25,
      ARC = useSquare ? this.squareArc : d3.arc();
    width = radiusL * 2, height = radiusL * 2,
      w = width + margin.left + margin.right;
    h = height + margin.bottom + margin.top;
    const svgBase = d3.select(id).attr('class', 'main').append('g').append('svg');
    let soFar = 0;
    svgBase
      .attr('height', h)
      .attr('width', w);
    svgBase.append('rect')
      .attr('class', 'rim')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', w)
      .attr('height', h);
    const svg = svgBase.append('g')
      .attr('transform', `translate(${margin.left + radiusL},${margin.top + radiusL})`);
    svg.selectAll('path.newfive').data(Data).enter()
      .append('path')
      .attr('class', d => `newfive ${d.name}`)
      .attr('d', (d, i) => {
        if (i % 3 === 0) {
          soFar = 0;
        }
        const st = soFar, en = soFar + d.value / d.total;
        const back = ARC({ outerRadius: radiusS, innerRadius: radiusS * 0.9, startAngle: st * 2 * Math.PI, endAngle: en * 2 * Math.PI });
        soFar = en;
        return '';
      })
      .transition().duration(2000).ease(d3.easeCircle)
      .attrTween('transform', d => (t: number) => {
        const diam = radiusS * 2, t0 = (1 - t) * (1 - t), circ = -+d.id * 0.25 * t0 * Math.PI / 4 +
          t * Math.floor((+d.id - 1) / 3);
        const back = Math.floor((+d.id - 1) / 3) === 0 ?
          `translate(${t0 * diam + t0 * diam * 2 * Math.cos(t0 * 10)},${-t0 * diam + t0 * diam * 2 * Math.sin(t0 * 10)})` :
          `translate(${diam * Math.cos(Math.PI / 2 * circ + extra)},
      ${diam * Math.sin(Math.PI / 2 * circ + extra)})`;
        return back;
      })
      .attrTween('d', (d, i) => tt => {
        const ARCHh = tt < 0.95 ? d3.arc() : ARC;
        if (i % 3 === 0) {
          soFar = 0;
        }
        const st = soFar, en = soFar + d.value / d.total;
        const back = ARCHh({ outerRadius: radiusS, innerRadius: radiusS * 0.9, startAngle: st * 2 * Math.PI, endAngle: en * 2 * Math.PI });
        soFar = en;
        return back;
      })
      ;

    const Datas: {
      id: number;
      type: string;
      name: string;
      value: number;
      outlierStatusType: string;
      withKE: boolean;
      total: number;
    }[] = [];
    Data.forEach(d => {
      const i = d.id - 1;
      if (i % 3 === 0) {
        Datas.push(d);
      }
    });
    svg.selectAll('text.newfive').append('g').data(Datas).enter()
      .append('text')
      .attr('class', 'newfive')
      .on('mouseover', (d, i, j) => d3.select(j[i]).transition().duration(2)
        .attr('class', 'newfive over')
        .styleTween('opacity', () => t => `${t}`))
      .on('mouseout', (d, i, j) => d3.select(j[i]).transition().duration(10)
        .attr('class', 'newfive')
        .styleTween('fill-opacity', () => t => `${-t * (1 - t) * 4 + 1}`))
      .transition().duration(2000)
      .tween('transform', (dh, i, j) => t => {
        const here = d3.select(j[i]), down = 8;
        const circ = Math.floor((dh.id - 1) / 3);
        const back = circ === 0 ?
          `translate(0,${down * t}) rotate(${-180 * (1 - t)})` : `translate(${radiusS * 2 * Math.cos(Math.PI / 2 * circ + extra)},
      ${radiusS * 2 * Math.sin(Math.PI / 2 * circ + extra) + down * t}) rotate(${180 * (1 - t)})`;
        here
          .attr('transform', back)
          .style('fill-opacity', (-t * (1 - t) * 4 + 1))
          .text(dh.outlierStatusType);
      })
      ;
    svg.selectAll('path.newfive')
      .on('mousemove', (dd, i, j) => {
        const here = d3.select(j[i]);
        const d = Data[i];
        this.tooltip.style('left', d3.event.pageX - 5 + 'px')
          .style('top', d3.event.pageY + 7 + 'px')
          .style('display', 'inline-block')
          .html(`<i class='fa fa-gears leafy'></i>${d.outlierStatusType}<br>${d.name}<br>${d.value}`);
      })
      .on('mouseout', () => this.tooltip.transition().duration(2).style('display', 'none'))
      .on('click', (d, i, j) => click(i, j))
      ;

  }
  fiveCircles(w = 960, h = 500, displayData = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR'], id = 'app-users') {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    let width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;
    const squareSide = Math.min(width, height);
    width = squareSide, height = squareSide,
      w = width + margin.left + margin.right;
    h = height + margin.bottom + margin.top;
    const svgBase = d3.select(id).attr('class', 'main').append('g').append('svg'), circleRad = squareSide / 6, root2 = Math.sqrt(2),
      spacer = (root2 * squareSide / 2 - 3 * circleRad) / 2 * root2,
      filler = d3.interpolateRgb('magenta', 'cyan');
    svgBase
      .attr('width', w)
      .attr('height', h);
    svgBase.append('rect')
      .attr('class', 'rim')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', w)
      .attr('height', h);
    const svg = svgBase.append('g')
      .attr('transform', `translate(${margin.left + squareSide / 2},${margin.top + squareSide / 2})`);
    svg.append('rect')
      .attr('class', 'five')
      .attr('x', -squareSide / 2)
      .attr('y', -squareSide / 2)
      .attr('width', squareSide)
      .attr('height', squareSide);
    svg.append('circle')
      .attr('class', 'five')
      .attr('cx', 0)
      .attr('cy', 0);
    svg.append('circle')
      .attr('class', 'five')
      .attr('cx', (circleRad + spacer) * root2 * Math.cos(Math.PI / 4))
      .attr('cy', (circleRad + spacer) * root2 * Math.sin(Math.PI / 4));
    svg.append('circle')
      .attr('class', 'five')
      .attr('cx', (circleRad + spacer) * root2 * Math.cos(3 * Math.PI / 4))
      .attr('cy', (circleRad + spacer) * root2 * Math.sin(3 * Math.PI / 4));
    svg.append('circle')
      .attr('class', 'five')
      .attr('cx', (circleRad + spacer) * root2 * Math.cos(5 * Math.PI / 4))
      .attr('cy', (circleRad + spacer) * root2 * Math.sin(5 * Math.PI / 4));
    svg.append('circle')
      .attr('class', 'five')
      .attr('cx', (circleRad + spacer) * root2 * Math.cos(7 * Math.PI / 4))
      .attr('cy', (circleRad + spacer) * root2 * Math.sin(7 * Math.PI / 4));
    svg.selectAll('.extra').append('g').data(displayData).enter()
      .append('text')
      .attr('class', 'five');
    svg.selectAll('circle.five')
      .style('fill', (d, i) => filler(i / 4))
      .attr('r', circleRad)
      .on('mouseover', (d, i, j) => {
        const here = d3.select(j[i]);
        here.transition().duration(20).attr('r', circleRad * 1.1);
        const hText = svg.selectAll('text.five');
        hText.text(`${displayData[i]}`)
          .attr('transform', `translate(${+(here.attr('cx').replace('px', ''))},${+(here.attr('cy').replace('px', ''))})`);
      })
      .on('mouseout', (d, i, j) => {
        const here = d3.select(j[i]);
        here.transition().duration(2000).attr('r', circleRad);
        const hText = svg.selectAll('text.five');
        hText
          .text('')
          .attr('transform', `translate(${+(here.attr('cx').replace('px', ''))},${+(here.attr('cy').replace('px', ''))})`);
      })
      ;
  }
  factorX(exposures = [
    {
      axis: 'UK Gilt Long-Short Yield Spread',
      value: -0.43706810000000007
    },
    {
      axis: 'IG Corp-UST Yield Spread',
      value: 0
    },
    {
      axis: 'HY Corp-UST Yield Spread',
      value: -1.5054635549691393
    },
    {
      axis: 'EM-UST Sov Yield Spread',
      value: 0.1402893
    },
    {
      axis: 'Equity',
      value: 0.5257086345508954
    },
    {
      axis: 'RPI',
      value: 0
    },
    {
      axis: 'BoE Interest Rates',
      value: 0
    },
    {
      axis: 'VIX',
      value: 0
    },
    {
      axis: 'Oil',
      value: -0.007541555
    },
    {
      axis: 'USD/GBP',
      value: -0.0603012272772637
    }
  ], wh = 100, id = 'app-users') {

    const minmaxE = [d3.min(exposures, d => d.value), d3.max(exposures, d => d.value)];
    const formatG = d3.format('0.3f');
    const newVals: number[] = Array(exposures.length);
    if (this.factorConstraintChange.length) {
      this.factorConstraintChange.forEach((d, i) => {
        if (d !== null) {
          newVals[i] = d;
        }
      });
    }
    this.factorConstraintChange = newVals;
    const angScaleSeparate: d3.ScaleLinear<number, number>[] = [];
    exposures.forEach(expo => {
      const aScale = d3.scaleLinear<number, number>()
        .domain(expo.value === 0 ? [-1, 1] : [-10 * Math.abs(expo.value), 10 * Math.abs(expo.value)])
        .range([2 * Math.PI / 5 + Math.PI / 2, -2 * Math.PI / 5 + Math.PI / 2]);
      angScaleSeparate.push(aScale);
    });
    const labPad = 5, padRow = 5, numCol = 4,
      width = wh * numCol, height = (wh + labPad * 1.5) * exposures.length / numCol, mx = 40, my = 40,
      svg = d3.select(id).attr('class', 'main').append('svg').attr('x', 0)
        .attr('y', my)
        .attr('width', width + mx * 2)
        .attr('height', height + my * 2),
      th = 4, rad = Math.min((width - padRow * (numCol - 1)) / numCol, height),
      dialParts = [], npoints = 50;
    for (let i = 0; i < npoints; ++i) {
      dialParts.push(i);
    }
    svg.append('rect')
      .attr('class', 'meterbackground')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width + mx * 2)
      .attr('height', height + my * 2);
    const gaugeplate = svg.append('g');
    gaugeplate.selectAll('.meters').select('g').data(exposures).enter()
      .append('path')
      .attr('class', 'meters')
      .attr('transform', (d, i) => `translate(${mx + rad / 2 + (i % numCol) * (rad + padRow)},
      ${my + rad / 2 + Math.floor(i / numCol) * (rad + labPad)})`)
      .attr('d', (d, iExp) => {
        const angle = angScaleSeparate[iExp](d.value), cc = (rad - th * 2) * Math.cos(angle), ss = (rad - th * 2) * Math.sin(angle);
        return `M${-rad / 2} 0l0 -${th}l${rad} 0l0 ${th}Z` + `M0 0l${th / 2} 0l${cc / 2} ${-ss / 2}l-${th} 0l${-cc / 2} ${ss / 2}Z`;
      }
      );
    gaugeplate.selectAll('.meters').select('g').data(exposures).enter()
      .append('text')
      .attr('class', 'meters')
      .attr('x', -rad / 2 + th * 4)
      .attr('y', -rad / 2 + th)
      .attr('transform', (d, i) => `translate(${mx + rad / 2 + (i % numCol) * (rad + padRow)},
      ${my + rad / 2 + Math.floor(i / numCol) * (rad + labPad)})`)
      .text(d => formatG(d.value));
    gaugeplate.selectAll('.meters').select('g').data(exposures).enter()
      .append('text')
      .attr('class', 'factorlabels')
      .attr('x', 0)
      .attr('y', th * 4)
      .attr('dy', '1.5em')
      .attr('transform', (d, i) => `translate(${mx + rad / 2 + (i % numCol) * (rad + padRow)},
      ${my + rad / 2 + Math.floor(i / numCol) * (rad + labPad)})`)
      .text(d => d.axis)
      .call(this.wrapFunction, 190, 1);
    gaugeplate.selectAll('.newvals').data(newVals).enter()
      .append('text')
      .attr('class', 'newvals')
      .attr('x', rad / 2 - th * 7)
      .attr('y', -rad / 2 + th)
      .attr('transform', (d, i) => `translate(${mx + rad / 2 + (i % numCol) * (rad + padRow)},
      ${my + rad / 2 + Math.floor(i / numCol) * (rad + labPad)})`)
      .text(d => isNaN(+formatG(d)) ? '' : formatG(d));
    for (let iExp = 0; iExp < exposures.length; ++iExp) {
      gaugeplate.append('g').selectAll('.dials').data(dialParts).enter()
        .append('path')
        .attr('class', () => `dials${iExp} dscale`)
        .attr('transform', () => `translate(${mx + rad / 2 + (iExp % numCol) * (rad + padRow)},
        ${my + rad / 2 + Math.floor(iExp / numCol) * (rad + labPad)})`)
        .attr('d', (d, iDialPart) => {
          const st = iDialPart / (dialParts.length) * (angScaleSeparate[iExp].range()[0] -
            angScaleSeparate[iExp].range()[1]) + angScaleSeparate[iExp].range()[1];
          const en = (iDialPart + 1) / (dialParts.length) * (angScaleSeparate[iExp].range()[0] -
            angScaleSeparate[iExp].range()[1]) + angScaleSeparate[iExp].range()[1];
          return d3.arc()({
            innerRadius: rad / 2 - th, outerRadius: rad / 2, startAngle: st - Math.PI / 2,
            endAngle: en - Math.PI / 2
          });
        });
      gaugeplate.selectAll(`.dials${iExp}`)
        .on('mouseover', (d, iDialPart, jj) => {
          const here = d3.select(jj[iDialPart]);
          here
            .transition().duration(2)
            .attr('class', 'dscale choose');
          const newVal = (iDialPart + 0.5) / (dialParts.length) * (angScaleSeparate[iExp].range()[1] -
            angScaleSeparate[iExp].range()[0]) + angScaleSeparate[iExp].range()[0];
          console.log(angScaleSeparate[iExp].invert(newVal));
          const newV = angScaleSeparate[iExp].invert(newVal);
          gaugeplate.selectAll('.newvals')
            .text((df, iii) => iii === iExp ? formatG(newV) : isNaN(+formatG(newVals[iii])) ? '' : formatG(newVals[iii]));
        })
        .on('click', (d, iDialPart, jj) => {
          const here = d3.select(jj[iDialPart]);
          here
            .transition().duration(2)
            .attr('class', 'dscale choose');
          let newVal = (iDialPart + 0.5) / (dialParts.length) * (angScaleSeparate[iExp].range()[1] -
            angScaleSeparate[iExp].range()[0]) + angScaleSeparate[iExp].range()[0];
          console.log(angScaleSeparate[iExp].invert(newVal));
          newVals[iExp] = angScaleSeparate[iExp].invert(newVal);
          const refineInput = d3.select('app-users').insert('input')
            .attr('type', 'text')
            .attr('id', 'newhandsfield')
            .attr('value', (newVals[iExp]))
            .on('change', () => {
              newVals[iExp] = +refineInput.node().value;
              newVal = angScaleSeparate[iExp](newVals[iExp]);
              d3.selectAll('#newhandsfield').remove();
              drawWantedPart();
            })
            ;
          const drawWantedPart = () => {
            gaugeplate.selectAll('.newvals')
              .text((df, iii) => iii === iExp ? formatG(newVals[iExp]) : isNaN(+formatG(newVals[iii])) ? '' : formatG(newVals[iii]));
            gaugeplate.selectAll('.meters')
              .attr('d', (df, iii, jjj) => {
                const here1 = d3.select(jjj[iii]);
                const old = here1.attr('d'), th1 = th / 10;
                if (iii === iExp) {
                  const oldc = old.replace(/Z m.*/, 'Z').replace(/Zm.*/, 'Z');
                  console.log(old);
                  console.log(oldc);
                  const angle = angScaleSeparate[iExp](newVals[iExp]), cc = (rad - th * 2) * Math.cos(angle),
                    ss = (rad - th * 2) * Math.sin(angle);
                  return oldc + `m0 0M0 0l${th1 / 2} 0l${cc / 2} ${-ss / 2}l ${th1} 0l${-cc / 2} ${ss / 2}Z`;
                } else {
                  return old;
                }
              });
          };
          drawWantedPart();
        })
        .on('mouseout', (d, iDialPart, jj) => {
          const here = d3.select(jj[iDialPart]);
          const colour = here.style('fill');
          gaugeplate.selectAll('.newvals').text((df, iii) => isNaN(+formatG(newVals[iii])) ? '' : formatG(newVals[iii]));
          here.transition().duration(2)
            .attr('class', 'dscale');
        })
        ;
    }
    return svg;
  }
  simpleDisplay(displayData: any) {
    const keys = Object.keys(displayData[0]), www = keys.length;
    const facNames: string[] = displayData.map(d => d[keys[0]]);
    const longNameLength = d3.max(facNames, d => d.length);
    const xPosArray: number[] = Array(www), off = 20, ww = Math.max(0, off * 8 + www * longNameLength * 8);
    for (let i = 0; i < www; ++i) {
      xPosArray[i] = ((ww - off) / www * i);
    }
    const nDat = displayData.length,
      xPos = (f: number) => xPosArray[f],
      base = d3.select('app-users').append('svg').attr('width', ww).attr('height', (nDat + 1) * 21 + 30);
    // base = d3.select('app-users').append('svg').attr('viewBox', `${0} 0 ${ww} ${(nDat + 1) * 21 + 30}`);
    base.append('rect')
      .attr('class', 'users')
      .attr('width', ww - off)
      .attr('height', 24)
      .attr('x', 5)
      .attr('y', 3);
    base.append('rect')
      .attr('class', 'users')
      .attr('width', ww - off)
      .attr('height', nDat * 21 + 10)
      .attr('x', 5)
      .attr('y', 32);
    base.append('text')
      .attr('x', 5)
      .attr('y', 23)
      .attr('transform', `translate(${off},${0})`)
      .call((d) => d.each((dd, i, j) => {// We have to do it like this with call() rather than html() to get the tspan on IE on Windows 7
        const k = d3.select(j[i]);
        for (let kk = 0; kk < keys.length; ++kk) {
          k.append('tspan').attr('x', xPos(kk)).text(keys[kk]);
        }
      }))
      .attr('class', 'users')
      ;

    base.selectAll('inner').data(displayData).enter().append('text')
      .attr('x', 5)
      .attr('y', 54)
      .attr('transform', (d, i) => `translate(${off},${i * 21})`)
      .attr('lineindex', d => d['axis'])
      .call((d) => d.each((dd, i, j) => {// We have to do it like this with call() rather than html() to get the tspan on IE on Windows 7
        const k = d3.select(j[i]);
        for (let kk = 0; kk < keys.length; ++kk) {
          k.append('tspan').attr('x', xPos(kk)).text(keys[kk] === 'axis' || keys[kk] === 'id' ? dd[keys[kk]] :
            d3.format('0.2g')(dd[keys[kk]]));
        }
      }))
      .attr('class', 'users');
    base.selectAll('tspan') // This is a crude way to change table entries
      .on('click', (d, iii, jjj) => {
        const forNewText = d3.select('app-users').insert('input')
          .attr('type', 'text')
          .attr('size', '4px')
          .attr('value', (<SVGTSpanElement>jjj[iii]).textContent)
          .on('change', (dk, i, j) => {
            (<SVGTSpanElement>jjj[iii]).textContent = j[i].value;
            forNewText.remove();
          });
      })
      ;
  }
  RadarChart(id: string, data: { axis: string; value: number; }[][], options: {
    w: number; h: number;
    margin: { top: number; right: number; bottom: number; left: number; };
    maxValue: number; levels: number; roundStrokes: boolean; colour: d3.ScaleOrdinal<number, string>;
  }) {
    const cfg = {
      w: 600,				// Width of the circle
      h: 600,				// Height of the circle
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the SVG
      levels: 3,				// How many levels or inner circles should there be drawn
      maxValue: 0, 			// The value that the biggest circle will represent
      labelFactor: 1.25, 	// How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, 		// The number of pixels after which a label needs to be given a new line
      lineHeight: 1.4, 		// Height for wrapped lines
      opacityArea: 0.35, 	// The opacity of the area of the blob
      dotRadius: 3, 			// The size of the coloured circles of each blog
      opacityCircles: 0.1, 	// The opacity of the circles of each blob
      strokeWidth: 2, 		// The width of the stroke around each blob
      roundStrokes: false,	// If true the area and stroke will follow a round path (cardinal-closed)
      colour: d3.scaleOrdinal<number, string>(d3.schemeCategory10).domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    };
    if ('undefined' !== typeof options) {
      for (const i in options) {
        if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
      }
    }
    const maxValue = Math.max(cfg.maxValue, +d3.max(data, (i) => d3.max(i.map((o) => o.value))));
    const minValue = Math.min(cfg.maxValue, +d3.min(data, (i) => d3.min(i.map((o) => o.value))));
    const allAxis = (data[0].map((i) => i.axis)),	// Names of each axis
      total = allAxis.length,					// The number of different axes
      radius = Math.min(cfg.w, cfg.h) / 2, 	// Radius of the outermost circle
      percentFormat = maxValue < 1 ? d3.format('.1%') : d3.format('0.1f');
    let pMin = Math.min(-maxValue, minValue);
    const pMax = Math.max(-minValue, maxValue);
    if (minValue >= -1e-15) {
      pMin = 0;
    }
    const rScale = d3.scaleLinear<number, number>()
      .range([0, radius])
      .domain([pMin, pMax]);
    const svg = d3.select(id).attr('class', 'main').append('g').append('svg'), doView = false;
    if (doView) {
      svg.attr('viewBox', `0 0 ${cfg.w + cfg.margin.left + cfg.margin.right} ${cfg.h + cfg.margin.top + cfg.margin.bottom}`)
        .attr('class', 'radar' + id);
    } else {
      svg
        .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
        .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'radar' + id);
    }
    const g = svg.append('g')
      .attr('transform', 'translate(' + (cfg.w / 2 + cfg.margin.left) + ',' + (cfg.h / 2 + cfg.margin.top) + ')'),
      filter = g.append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'colouredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'colouredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic'),
      axisGrid = g.append('g').attr('class', 'axisWrapper');

    const circScale = d3.scaleLinear<number, number>().domain([pMin < 0 ? -cfg.levels : 0, cfg.levels]).range([0, radius]);
    const circVal = d3.scaleLinear<number, number>().domain([pMin < 0 ? -cfg.levels : 0, cfg.levels])
      .range([pMin, pMax]);
    const angleScale = d3.scaleLinear<number, number>().domain([0, data[0].length]).range([0, Math.PI * 2]);
    axisGrid.selectAll('.levels')
      .data(d3.range(pMin < 0 ? -cfg.levels : 0, (cfg.levels + 1)).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d) => circScale(d))
      .style('fill-opacity', cfg.opacityCircles)
      .style('stroke-opacity', cfg.opacityCircles)
      .style('filter', 'url(#glow)');
    if (pMin < 0) {
      axisGrid.append('path')
        .attr('class', 'gridZero')
        .attr('d', () => d3.arc()({
          innerRadius: circScale(0),
          outerRadius: circScale(0),
          startAngle: 0,
          endAngle: 0
        }))
        .transition().duration(2000)
        .attrTween('d', () => (t) => d3.arc()({
          innerRadius: circScale(0),
          outerRadius: circScale(0),
          startAngle: -(t + 0.5) * Math.PI,
          endAngle: (t - 0.5) * Math.PI
        }));
    }
    const radarLine = d3.lineRadial<{ axis: string, value: number }>()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(d.value))
      .angle((d, i) => angleScale(i));
    const radarLineZ = d3.lineRadial<{ axis: string, value: number }>()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(0))
      .angle((d, i) => angleScale(-i)); // Minus is important to get the shading correct!
    if (cfg.roundStrokes) {
      radarLine.curve(d3.curveCatmullRomClosed);
      radarLineZ.curve(d3.curveCatmullRomClosed);
    }
    const blobChooser = (k: number) =>
      // tslint:disable-next-line:max-line-length
      `M${cfg.margin.right / 2 + radius} ${-cfg.margin.right / 2 - radius + k * radius / 10}l${radius / 10} 0l0 ${radius / 10}l-${radius / 10} 0z`;
    const blobWrapper = g.selectAll('.radarWrapper')
      .data(data)
      .enter().append('g')
      .attr('data-index', (d, i) => i)
      .attr('class', 'radarWrapper');
    blobWrapper
      .append('path')
      .attr('class', 'portfolioFlower')
      .attr('d', (d, i) => (pMin < 0 ? radarLine(d) + radarLineZ(d) : radarLine(d)) + blobChooser(i))
      .style('fill', (d, i) => cfg.colour(i))
      .style('fill-opacity', cfg.opacityArea)
      .on('mouseover', (d, i, jj) => {
        // Dim all blobs
        d3.selectAll('.portfolioFlower')
          .transition().duration(2)
          .style('fill-opacity', 0.1);
        d3.selectAll('.weightSinglePlus')
          .transition().duration(2)
          .style('fill-opacity', 0.1);
        d3.selectAll('.weightSingleMinus')
          .transition().duration(2)
          .style('fill-opacity', 0.1);
        // Bring back the hovered over blob
        d3.select(jj[i])
          .transition().duration(2)
          .style('fill-opacity', 0.7);
        d3.selectAll(`.weightSinglePlus`).nodes().forEach(hh => {
          const h = d3.select(hh);
          if (+h.attr('picId') === i) {
            h.transition().duration(2)
              .style('fill-opacity', 0.7);
          }
        });
        d3.selectAll(`.weightSingleMinus`).nodes().forEach(hh => {
          const h = d3.select(hh);
          if (+h.attr('picId') === i) {
            h.transition().duration(2)
              .style('fill-opacity', 0.7);
          }
        });
        d3.selectAll(`.totals`).nodes().forEach(hh => {
          const h = d3.select(hh);
          if (+h.attr('picId') === i) {
            h.classed('over', true);
          }
        });
      })
      .on('mouseout', () => {
        d3.selectAll('.portfolioFlower')
          .transition().duration(10)
          .style('fill-opacity', cfg.opacityArea);
        d3.selectAll('.weightSinglePlus')
          .transition().duration(2)
          .style('fill-opacity', cfg.opacityArea);
        d3.selectAll('.weightSingleMinus')
          .transition().duration(2)
          .style('fill-opacity', cfg.opacityArea);
        d3.selectAll('.totals').classed('over', false);
      }
      );
    blobWrapper.append('path')
      .attr('class', 'radarStroke')
      .style('stroke-width', cfg.strokeWidth + 'px')
      .style('stroke', 'white')
      .transition()
      .ease(d3.easeBounce)
      .duration(2000)
      .attr('d', (d) => radarLine(d))
      .style('stroke', (d, i) => cfg.colour(i))
      .style('fill', 'none')
      .style('filter', 'url(#glow)');
    blobWrapper.selectAll('.radarCircle')
      .data((d) => d)
      .enter().append('circle')
      .attr('class', 'radarCircle')
      .attr('r', cfg.dotRadius)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleScale(i) - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.colour(+d3.select(<HTMLSelectElement>(j[i]).parentNode).attr('data-index')))
      .style('fill-opacity', 0.8);
    const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
      .data(data)
      .enter().append('g')
      .attr('data-index', (d, i) => i)
      .attr('class', 'radarCircleWrapper');
    blobCircleWrapper.selectAll('.radarInvisibleCircle')
      .data((d) => d)
      .enter().append('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', cfg.dotRadius * 1.1)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleScale(i) - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.colour(+d3.select(<HTMLSelectElement>(j[i]).parentNode).attr('data-index')))
      .style('pointer-events', 'all')
      .on('mouseover', (d, i, j) => localTiptool
        .attr('x', parseFloat((d3.select(j[i])).attr('cx')) - 10)
        .attr('y', parseFloat((d3.select(j[i])).attr('cy')) - 10)
        .style('fill', 'none')
        .style('opacity', 1)
        .text(percentFormat(+d.value))
        .transition().duration(200)
        .style('fill', (j[i]).style['fill']))
      .on('mouseout', () => localTiptool.transition().duration(200).style('fill', 'none'));

    const axis = axisGrid.selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis');
    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 10)
      .attr('y2', -10)
      .transition()
      .ease(d3.easeBounce)
      .duration(2000)
      .tween('lines', (d, i, j) => (t) => {
        const HERE = j[i], extension = 1.13;
        HERE.setAttribute('x2', '' + rScale(pMax * extension) * Math.cos(angleScale(i) - Math.PI / 2) * t);
        HERE.setAttribute('y2', '' + rScale(pMax * extension) * Math.sin(angleScale(i) - Math.PI / 2) * t);
      })
      .attr('class', 'line');
    axis.append('text')
      .attr('class', 'legendRadar')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(pMax * cfg.labelFactor) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('y', (d, i) => rScale(pMax * cfg.labelFactor) * Math.sin(angleScale(i) - Math.PI / 2))
      .text((d) => d)
      .call(this.wrapFunction, cfg.wrapWidth, cfg.lineHeight);
    axisGrid.selectAll('.axisLabel')
      .data(d3.range(pMin < 0 ? -cfg.levels : 0, (cfg.levels + 1)).reverse())
      .enter().append('text')
      .attr('class', 'axisRadar')
      .attr('x', -12)
      .attr('y', (d) => -circScale(d))
      .attr('dy', '0.4em')
      .text((d, i) => percentFormat(circVal(d)));
    const localTiptool = g.append('text')
      .attr('class', 'tooltipRadar')
      .style('opacity', 0);
  }
  wrapFunction = (text1: any, width: number, lineHeight: number) =>  // Adapted from http://bl.ocks.org/mbostock/7555321
    text1.each((_kk, i, j) => {
      const text = d3.select(j[i]),
        words = text.text().split(/\s+/).reverse(),
        y = text.attr('y'),
        x = text.attr('x'),
        dy = parseFloat(text.attr('dy'));
      let word, line = [],
        lineNumber = 0,
        tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if ((<SVGTSpanElement>tspan.node()).getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
        }
      }
    })
  stockbars = (DATA: { axis: string, value: number, alpha: number }[], dataIndex: number, ww: number, hh: number,
    durationtime: number, xText = 'Weight', yText = 'Class') => {
    const svg = d3.select('app-users').append('svg')
      .attr('width', ww)
      .attr('height', hh).attr('class', 'stockbars').append('g'),
      chart = svg.append('g'),
      scaleAll = 1;
    const margin = {
      top: 50 * scaleAll,
      right: 50 * scaleAll,
      bottom: 150 * scaleAll,
      left: 70 * scaleAll
    }, bandfiddle = 10000
      , customXAxis = (g: d3.Selection<SVGGElement, {}, HTMLElement, any>) => {
        g.call(d3.axisBottom(xx).tickSize(0));
        const g1 = g.select('.domain').attr('class', 'axis');
        const g2 = g.selectAll('text').attr('class', 'axisNames')
          .attr('x', -5 * scaleAll)
          .attr('y', -5 * scaleAll)
          .attr('transform', 'rotate(-70)');
        if (DATA.length > 30) {
          g.selectAll('text').style('fill', 'none').style('stroke', 'none');
        }
        if (scaleAll < 1.0) {
          g1.style('font-size', (+g1.style('font-size').replace('px', '') * scaleAll) + 'px');
          g2.style('font-size', (+g2.style('font-size').replace('px', '') * scaleAll) + 'px');
        }
      }
      , rim = 5 * scaleAll
      , width = ww - margin.left - margin.right
      , height = hh - margin.top - margin.bottom
      , x = d3.scaleBand().rangeRound([0, bandfiddle * width]).paddingInner(0.1)
      , xx = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1)
      , y = d3.scaleLinear<number, number>().range([height, 0])
        .domain([Math.min(0, d3.min(DATA, (d) => d.value)),
        d3.max(DATA, (d) => d.value)]);
    svg.attr('transform', `translate(${margin.left}, ${margin.top})`);
    x.domain(DATA.map((d) => d.axis)).padding(0.1);
    xx.domain(DATA.map((d) => d.axis)).padding(0.1);
    const yAxis = d3.axisLeft(y).ticks(2)
      , svgX = svg.append('g').attr('transform', `translate(0, ${height})`).attr('class', 'axis').call(customXAxis)
      , svgY = svg.append('g').attr('transform', 'translate(0,0)').attr('class', 'axis').call(yAxis)
      , titleY = svg.append('text').attr('class', 'axisLabel').attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left * 0.6).attr('x', 0 - (height / 2)).text(xText)
      , titleX = svg.append('text').attr('transform', 'translate(0, ' + height + ')')
        .attr('class', 'axisLabel').attr('x', width / 2).attr('y', margin.bottom * 0.9)
        .text(yText)
      , rimmy2 = svg.append('rect').attr('class', 'rim').attr('x', 0).attr('y', 0)
        .attr('width', width).attr('height', height)
      , rimmy1 = svg.append('rect').attr('class', 'rim').attr('x', -margin.left)
        .attr('y', -margin.top).attr('width', ww).attr('height', hh);
    // -----------------------------------------------Rim Outline-----------------------------------
    chart.selectAll('.bar').data(DATA).enter().append('rect').attr('class', 'barrim')
      .attr('width', x.bandwidth() / bandfiddle + 2 * rim)
      .attr('x', (d) => x(d.axis) / bandfiddle - rim)
      .attr('height', (d) => rim + (d.value <= 0 ? y(d.value) - y(0) : y(0) - y(d.value)))
      .attr('y', (d) => (d.value <= 0 ? y(0) : y(d.value) - rim))
      .on('mousemove', (d) => this.tooltip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px')
        .style('display', 'inline-block')
        .html(`<i class='fa fa-gears leafy'></i>${d.axis}<br>weight:${d.value}`))
      .on('mouseout', (d) => this.tooltip.style('display', 'none'));
    // --------------------------------------------------------------------------------------------
    chart.selectAll('.bar').data(DATA).enter().append('rect')
      .attr('width', x.bandwidth() / bandfiddle)
      .attr('x', (d) => x(d.axis) / bandfiddle)
      .attr('height', (d) => {
        const deviation = 0;
        return deviation <= 0 ? y(deviation) - y(0) : y(0) - y(deviation);
      })
      .attr('y', (d) => {
        const deviation = 0;
        return deviation <= 0 ? y(0) : y(deviation);
      })
      .attr('class', (d) => d.value > 0 ? 'weightSinglePlus' : 'weightSingleMinus')
      .attr('picId', dataIndex)
      .style('fill-opacity', 0.35)
      .on('mousemove', (d) => this.tooltip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px').style('display', 'inline-block')
        .html(`<i class='fa fa-gears leafy'></i>${d.axis}<br>weight:${d3.format('0.5f')(d.value)}<br>
        ${d.alpha === undefined ? '' : 'alpha:' + d3.format('0.5f')(d.alpha)}`))
      .on('mouseout', (d) => this.tooltip.style('display', 'none'))
      .transition().duration(durationtime)
      .attr('height', (d) => d.value <= 0 ? y(d.value) - y(0) : y(0) - y(d.value))
      .attr('y', (d) => d.value <= 0 ? y(0) : y(d.value));
    if (scaleAll < 1) {
      chart.style('stroke-width', +chart.style('stroke-width').replace('px', '') * scaleAll);
      titleX.style('font-size', (+titleX.style('font-size').replace('px', '') * scaleAll) + 'px');
      titleY.style('font-size', (+titleY.style('font-size').replace('px', '') * scaleAll) + 'px');
      svgX.style('font-size', (+svgX.style('font-size').replace('px', '') * scaleAll) + 'px');
      svgY.style('font-size', (+svgY.style('font-size').replace('px', '') * scaleAll) + 'px');
    }
  }
}
