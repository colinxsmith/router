import { Component, ViewEncapsulation, OnChanges, SimpleChanges, Input } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserService } from './user.service';
import * as d3 from 'd3';
import { map } from 'rxjs/operators';
import { scaleQuantile, ContainerElement } from 'd3';
import { fcall } from 'q';
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
  optType: string[];
  @Input() getType = '';
  @Input() nStocks: number;
  @Input() factorConstraintChange: number[] = [];
  constructor(private userService: UserService, private appComponent: AppComponent) {
    this.optType = this.appComponent.optType;
  }
  sendOpt() {
    this.changeLs(this.getType, this.updateLabel !== 'MAKE POINTED');
  }
  resetOpt() {
    this.factorConstraintChange = [];
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
  pickOutNonZeroValues(data: { alpha: number, axis: string, value: number, id: number }[][]) {
    data = this.choose2[0] === this.choose2[1] ? data : [data[this.choose2[0]], data[this.choose2[1]]];
    const displayData: { alpha: number, axis: string, value: number, id: number }[][] = [];
    const maxFac: number[] = Array(data[0].length);
    const minFac: number[] = Array(data[0].length);
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
      while (numberOk < 12 && base > 1e-5) {
        numberOk = 0;
        dad.forEach((vals, i) => {
          if (!(minFac[i] > -base && maxFac[i] < base)) {
            numberOk++;
          }
        });
        if (numberOk < 12 && base > 1e-5) {
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
    d3.select('app-users').selectAll('svg').remove();
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
    d3.select('app-root').selectAll('.send').remove();
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
        this.appComponent.changeStocks(+da2.nstocks);
        //        this.nStocks = +da2.nstocks;
        this.appComponent.changeType(da2.type);
        //        this.getType = da2.type;
        this.appComponent.changeWants(da2.factorWants);
        //        this.factorConstraintChange = da2.factorWants;
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
          if (this.displayData.length < 4) {
            this.plotLab.forEach((d, i) => {
              if (i >= this.displayData.length) {
                this.plotLab[i] = undefined;
              }
            });
          }
          const margin = { top: 150, right: 150, bottom: 150, left: 150 }, ww = 1000, hh = 1000,
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
            this.stockbars(ddd, id, ww * 0.5, hh * 0.5, 2000, 'Factor Exposure', 'Factor');
            this.simpleDisplay(ddd);
          });
        } else if (this.getKey === 'OPT') {
          if (this.displayData.length < 4) {
            this.plotLab.forEach((d, i) => {
              if (i >= this.displayData.length) {
                this.plotLab[i] = undefined;
              }
            });
          }
          const margin = { top: 150, right: 150, bottom: 150, left: 150 }, ww = 1000, hh = 1000,
            width = ww - margin.left - margin.right,
            height = hh - margin.top - margin.bottom,
            radarBlobColour = d3.scaleOrdinal<number, string>().range(['rgb(255,50,50)', 'rgb(50,255,50)',
              'rgb(255,255,50)', 'rgb(50,255,255)']),
            radarChartOptions = {
              w: width, h: height, margin: margin, maxValue: 0,
              levels: 4, roundStrokes: !joinLinear, colour: radarBlobColour
            };

          let data1: { alpha: number, axis: string, value: number, id: number }[][]
            = this.displayData[0].portfolio !== undefined ? this.displayData.map((ddd) => ddd.portfolio) : this.displayData;
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
            d3.select('app-users').append('svg').attr('width', 800).attr('height', 50).append('g').append('text')
              .attr('transform', 'translate(0,30)').attr('class', 'users')
              .text(() => `Risk: ${this.displayData[i].risk}, Return: ${this.displayData[i].return},
                  gamma: ${this.displayData[i].gamma}`);
            this.stockbars(ddd, i, ww * 0.5, hh * 0.5, 2000, 'Weights', 'Assets');
            this.simpleDisplay(ddd);
          });
        } else if (this.getKey === 'newData') {
          if (this.displayData.length !== undefined) {
            this.simpleDisplay(this.displayData);
          } else {
            this.simpleDisplay([this.displayData]);
          }
        } else if (this.getKey === 'factorX') {
          d3.select('app-users').append('svg').attr('width', 960).attr('height', 50).append('g').append('text')
            .attr('transform', 'translate(0,20)').attr('class', 'newvals').attr('x', 0).attr('y', 0).style('text-anchor', 'start')
            .text(`Risk: ${this.displayData.risk} Return: ${this.displayData.return} Return status: ${this.displayData.back}`);
          this.factorX(this.displayData.factors);
        }
      }, res => {
        console.log(res);
      });

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
  ]) {

    const minmaxE = [d3.min(exposures, d => d.value), d3.max(exposures, d => d.value)];
    const formatG = d3.format('0.3f');
    const newVals = Array(exposures.length);
    if (this.factorConstraintChange) {
      this.factorConstraintChange.forEach((d, i) => {
        if (d !== null) {
          newVals[i] = d;
        }
      });
    }
    this.factorConstraintChange = newVals;
    const angScale = d3.scaleLinear<number, number>()
      .domain(minmaxE).range([2 * Math.PI / 5 + Math.PI / 2, -2 * Math.PI / 5 + Math.PI / 2]);
    const width = 200, height = 20000, mx = 10, my = 10,
      svg = d3.select('app-users').append('svg')
      , th = 2, rad = Math.min(width, height);
    svg.attr('x', 0)
      .attr('y', 0)
      .attr('width', width + mx)
      .attr('height', height + my)
      .attr('class', 'factorgauge');
    const gaugeplate = svg.append('g');
    gaugeplate.selectAll('.meters').select('g').data(exposures).enter()
      .append('path')
      .attr('class', 'meters')
      .style('fill', 'none')
      .style('stroke', 'green')
      .attr('transform', (d, i) => `translate(${mx + rad / 2},${my + rad / 2 + i * rad})`)
      .attr('d', (d) => {
        const cc = (rad - th * 2) * Math.cos(angScale(d.value)), ss = (rad - th * 2) * Math.sin(angScale(d.value));
        return `M0,0,l${th / 2},0l${cc / 2},${-ss / 2},l-${th},0l${-cc / 2},${ss / 2}z` + `M${-rad / 2},0l0,-${th}l${rad},0l0,${th}Z`;
      }
      );
    gaugeplate.selectAll('.meters').select('g').data(exposures).enter()
      .append('text')
      .attr('class', 'meters')
      .attr('x', -rad / 2 + th * 4)
      .attr('y', -rad / 2 + th)
      .attr('transform', (d, i) => `translate(${mx + rad / 2},${my + rad / 2 + i * rad})`)
      .text(d => formatG(d.value));
    gaugeplate.selectAll('.meters').select('g').data(exposures).enter()
      .append('text')
      .attr('class', 'factorlabels')
      .attr('x', 0)
      .attr('y', th * 4)
      .attr('transform', (d, i) => `translate(${mx + rad / 2},${my + rad / 2 + i * rad})`)
      .text(d => d.axis);
    gaugeplate.selectAll('.newvals').select('g').data(newVals).enter()
      .append('text')
      .attr('class', 'newvals')
      .attr('x', rad / 2 - th * 10)
      .attr('y', -rad / 2 + th)
      .attr('transform', (d, i) => `translate(${mx + rad / 2},${my + rad / 2 + i * rad})`)
      .text(d => isNaN(+formatG(d)) ? '' : formatG(d));
    const dialParts = [], npoints = 50;
    for (let i = 0; i < npoints; ++i) {
      dialParts.push(i);
    }
    for (let i = 0; i < exposures.length; ++i) {
      gaugeplate.append('g').selectAll('.dials').data(dialParts).enter()
        .append('path')
        .attr('class', () => `dials${i}`)
        .style('fill', 'none')
        .style('stroke', 'red')
        .attr('transform', () => `translate(${mx + rad / 2},${my + rad / 2 + i * rad})`)
        .attr('d', (d, ii) => {
          const st = ii / (dialParts.length) * (angScale.range()[0] - angScale.range()[1]) + angScale.range()[1];
          const en = (ii + 1) / (dialParts.length) * (angScale.range()[0] - angScale.range()[1]) + angScale.range()[1];
          return d3.arc()({
            innerRadius: rad / 2 - th, outerRadius: rad / 2, startAngle: st - Math.PI / 2,
            endAngle: en - Math.PI / 2
          });
        });
      gaugeplate.selectAll(`.dials${i}`)
        .on('mouseover', (d, ii, jj) => {
          const here = d3.select(jj[ii]);
          here
            .transition().duration(2)
            .style('fill', 'red');
        })
        .on('click', (d, ii, jj) => {
          const here = d3.select(jj[ii]);
          here
            .transition().duration(2)
            .style('fill', 'rgb(0 , 128, 0)');
          const newVal = (ii + 0.5) / (dialParts.length) * (angScale.range()[1] - angScale.range()[0]) + angScale.range()[0];
          console.log(angScale.invert(newVal));
          newVals[i] = angScale.invert(newVal);
          gaugeplate.selectAll('.newvals').nodes().forEach((ddd, iii) => {
            const here1 = d3.select(ddd);
            if (iii === i) {
              console.log(`${here1.attr('x')} ${here1.attr('y')}  ${here1.text()} `);
              here1.text(formatG(newVals[i]));
              console.log(`${here1.attr('x')} ${here1.attr('y')}  ${here1.text()} `);
            }
          });
          gaugeplate.selectAll('.meters').nodes().forEach((ddd, iii) => {
            const here1 = d3.select(ddd);
            if (iii === i) {
              here1.attr('d', () => {
                const old = here1.attr('d').replace(/Z.*$/, 'Z'), th1 = th / 10;
                const cc = (rad - th * 2) * Math.cos(angScale(newVals[i])), ss = (rad - th * 2) * Math.sin(angScale(newVals[i]));
                return old + `M0,0,l${th1 / 2},0l${cc / 2},${-ss / 2},l-${th1},0l${-cc / 2},${ss / 2}z`;
              });
            }
          });
        })
        .on('mouseout', (d, ii, jj) => {
          const here = d3.select(jj[ii]);
          const colour = here.style('fill');
          here.transition().duration(2)
            .style('fill', 'none');
        })
        ;
    }
  }
  simpleDisplay(displayData: any) {
    const www = Object.keys(displayData[0]).length;
    const xPosArray: number[] = Array(www), off = 20, ww = Math.max(0, www * 250);
    for (let i = 0; i < www; ++i) {
      xPosArray[i] = ((ww - off) / www * i);
    }
    const nDat = displayData.length,
      xPos = (f: number) => xPosArray[f],
      base = d3.select('app-users').append('svg').attr('width', ww).attr('height', (nDat + 1) * 21 + 30);
    // base = d3.select('app-users').append('svg').attr('viewBox', `${0} 0 ${ww} ${(nDat + 1) * 21 + 30}`);
    base.append('text')
      .attr('x', 5)
      .attr('y', 23)
      .attr('transform', `translate(${off},${0})`)
      .call((d) => d.each((dd, i, j) => {// We have to it like this with call() rather than html() to get the tspan on IE on Windows 7
        const k = d3.select(j[i]);
        const keys = Object.keys(displayData[0]);
        let tspan = k.text(null).append('tspan').attr('x', xPos(0)).text(keys[0]);
        for (let kk = 1; kk < keys.length; ++kk) {
          tspan = k.append('tspan').attr('x', xPos(kk)).text(keys[kk]);
        }
      }))
      .attr('class', 'users');
    base.append('rect')
      .attr('class', 'users')
      .attr('width', ww - off)
      .attr('height', 24)
      .attr('x', 5)
      .attr('y', 3);
    base.selectAll('inner').data(displayData).enter().append('text')
      .attr('x', 5)
      .attr('y', 54)
      .attr('transform', (d, i) => `translate(${off},${i * 21})`)
      .call((d) => d.each((dd, i, j) => {// We have to it like this with call() rather than html() to get the tspan on IE on Windows 7
        const k = d3.select(j[i]);
        const keys = Object.keys(dd);
        let tspan = k.text(null).append('tspan').attr('x', xPos(0)).text(dd[keys[0]]);
        for (let kk = 1; kk < keys.length; ++kk) {
          tspan = k.append('tspan').attr('x', xPos(kk)).text(keys[kk] === 'axis' ? dd[keys[kk]] : d3.format('g')(dd[keys[kk]]));
        }
      }))
      .attr('class', 'users');
    base.append('rect')
      .attr('class', 'users')
      .attr('width', ww - off)
      .attr('height', nDat * 21 + 10)
      .attr('x', 5)
      .attr('y', 32);
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
    const svg = d3.select(id).append('svg'), doView = false;
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
      `M${radius * 1.2},${-radius * 1.2 + k * radius / 10}l${radius / 10},0,l0,${radius / 10},l-${radius / 10},0z`;
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
      .style('fill', (d, i, j) => cfg.colour(+(<HTMLSelectElement>(j[i]).parentNode).getAttribute('data-index')))
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
      .style('fill', (d, i, j) => cfg.colour(+(<HTMLSelectElement>(j[i]).parentNode).getAttribute('data-index')))
      .style('pointer-events', 'all')
      .on('mouseover', (d, i, j) => localTiptool
        .attr('x', parseFloat(((j[i])).getAttribute('cx')) - 10)
        .attr('y', parseFloat(((j[i])).getAttribute('cy')) - 10)
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
  wrapFunction = (text1, width: number, lineHeight: number) =>  // Adapted from http://bl.ocks.org/mbostock/7555321
    text1.each((kk, i, j) => {
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
      , tooltip = d3.select('body').append('g').attr('class', 'toolTip')
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
      .on('mousemove', (d) => tooltip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px')
        .style('display', 'inline-block')
        .html(`<i class="fa fa-gears leafy"></i>${d.axis}<br>weight:${d.value}`))
      .on('mouseout', (d) => tooltip.style('display', 'none'));
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
      .on('mousemove', (d) => tooltip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px').style('display', 'inline-block')
        .html(`<i class="fa fa-gears leafy"></i>${d.axis}<br>weight:${d3.format('0.5f')(d.value)}<br>
        ${d.alpha === undefined ? '' : 'alpha:' + d3.format('0.5f')(d.alpha)}`))
      .on('mouseout', (d) => tooltip.style('display', 'none'))
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
