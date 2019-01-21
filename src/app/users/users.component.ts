import { Component, ViewEncapsulation, OnChanges, SimpleChanges, Input } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserService } from './user.service';
import * as d3 from 'd3';
import { map } from 'rxjs/operators';
import { getTestBed } from '@angular/core/testing';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnChanges {
  displayData: any;
  updateLabel = 'MAKE POINTED';
  getKey = '';
  plotLab = [];
  plotLabels = { 'Low Risk': 1, 'High Risk': 2, 'Low Medium Risk': 3,  'High Medium Risk': 4 };
  choose2 = [0, 0];
  dbKeyData = ['radarData', 'OPT'].reverse();
  optType: string[];
  @Input() getType = '';
  @Input() nStocks: number;
  constructor(private userService: UserService, private appComponent: AppComponent) {
    this.optType = this.appComponent.optType;
  }
  ngOnChanges(changed: SimpleChanges) {
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
    this.getType = type;
    d3.select('app-users').selectAll('svg').remove();
    this.userService.postType(this.nStocks, this.getType).subscribe(res => {
      console.log(res);
      this.chooseData(this.getKey, pointed);
    });
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
      .getData(this.getKey)
      .pipe(map(data => { this.displayData = data; return data; }))
      .subscribe(data => {
        //        this.displayData = data;
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
          if (this.displayData.length < 4) {
            this.plotLab.forEach((d, i) => {
              if (i >= this.displayData.length) {
                this.plotLab[i] = undefined;
              }
            });
          }          const margin = { top: 150, right: 150, bottom: 150, left: 150 }, ww = 1000, hh = 1000,
            width = ww - margin.left - margin.right,
            height = hh - margin.top - margin.bottom,
            radarBlobColour = d3.scaleOrdinal<number, string>().range(['rgb(255,50,50)', 'rgb(50,255,50)',
            'rgb(255,255,50)', 'rgb(50,255,255)']),
            radarChartOptions = {
              w: width, h: height, choose2: this.choose2, margin: margin, maxValue: 0.1,
              levels: 3, roundStrokes: true, colour: radarBlobColour
            };
          this.RadarChart('app-users', this.displayData, radarChartOptions);
          this.displayData.forEach((ddd) => {
            this.stockbars(ddd, ww * 0.5, hh * 0.5, 2000, 'Factor Exposure', 'Factor');
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
              w: width, h: height, choose2: this.choose2, margin: margin, maxValue: 0.1,
              levels: 4, roundStrokes: !joinLinear, colour: radarBlobColour
            };

          const data1: [{ alpha: number, axis: string, value: number }[]]
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

          this.RadarChart('app-users', data1, radarChartOptions);
          data1.forEach((ddd, i: number) => {
            d3.select('app-users').append('svg').attr('width', 800).attr('height', 50).append('g').append('text')
              .attr('transform', 'translate(0,30)').attr('class', 'users')
              .text(() => `Risk: ${this.displayData[i].risk}, Return: ${this.displayData[i].return}, gamma: ${this.displayData[i].gamma}`);
            this.stockbars(ddd, ww * 0.5, hh * 0.5, 2000, 'Weights', 'Assets');
            this.simpleDisplay(ddd);
          });
        } else if (this.getKey === 'newData') {
          if (this.displayData.length !== undefined) {
            this.simpleDisplay(this.displayData);
          } else {
            this.simpleDisplay([this.displayData]);
          }
        }
      }, res => {
        console.log(res);
      });
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
          tspan = k.append('tspan').attr('x', xPos(kk)).text(dd[keys[kk]]);
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
    w: number; h: number; choose2: number[];
    margin: { top: number; right: number; bottom: number; left: number; };
    maxValue: number; levels: number; roundStrokes: boolean; colour: d3.ScaleOrdinal<number, string>;
  }) {
    const cfg = {
      w: 600,				// Width of the circle
      h: 600,				// Height of the circle
      choose2: [0, 0],
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the SVG
      levels: 3,				// How many levels or inner circles should there be drawn
      maxValue: 0, 			// The value that the biggest circle will represent
      labelFactor: 1.25, 	// How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, 		// The number of pixels after which a label needs to be given a new line
      lineHeight: 1.4, 		// Height for wrapped lines
      opacityArea: 0.35, 	// The opacity of the area of the blob
      dotRadius: 3, 			// The size of the coloured circles of each blog
      opacityCircles: 0.1, 	// The opacity of the circles of each blob
      strokeWidth: 4, 		// The width of the stroke around each blob
      roundStrokes: false,	// If true the area and stroke will follow a round path (cardinal-closed)
      colour: d3.scaleOrdinal<number, string>(d3.schemeCategory10).domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    };
    if ('undefined' !== typeof options) {
      for (const i in options) {
        if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
      }
    }
    const choose2 = cfg.choose2;
    const maxValue = Math.max(cfg.maxValue, +d3.max(data, (i) => d3.max(i.map((o) => o.value))));
    const allAxis = (data[0].map((i) => i.axis)),	// Names of each axis
      total = allAxis.length,					// The number of different axes
      radius = Math.min(cfg.w / 2, cfg.h / 2), 	// Radius of the outermost circle
      percentFormat = d3.format('.1%');

    const rScale = d3.scaleLinear<number, number>()
      .range([0, radius])
      .domain([-maxValue, maxValue]);
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

    const circScale = d3.scaleLinear<number, number>().domain([-cfg.levels, cfg.levels]).range([0, radius]);
    const circVal = d3.scaleLinear<number, number>().domain([-cfg.levels, cfg.levels]).range([-maxValue, maxValue]);
    const angleScale = d3.scaleLinear<number, number>().domain([0, data[0].length]).range([0, Math.PI * 2]);
    axisGrid.selectAll('.levels')
      .data(d3.range(-(cfg.levels), (cfg.levels + 1)).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d) => circScale(d))
      .style('fill-opacity', cfg.opacityCircles)
      .style('stroke-opacity', cfg.opacityCircles)
      .style('filter', 'url(#glow)');
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
    axisGrid.selectAll('.axisLabel')
      .data(d3.range(-(cfg.levels), (cfg.levels + 1)).reverse())
      .enter().append('text')
      .attr('class', 'axisRadar')
      .attr('x', 4)
      .attr('y', (d) => -circScale(d))
      .attr('dy', '0.4em')
      .text((d, i) => percentFormat(circVal(d)));
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
        HERE.setAttribute('x2', '' + rScale(maxValue * extension) * Math.cos(angleScale(i) - Math.PI / 2) * t);
        HERE.setAttribute('y2', '' + rScale(maxValue * extension) * Math.sin(angleScale(i) - Math.PI / 2) * t);
      })
      .attr('class', 'line');
    axis.append('text')
      .attr('class', 'legendRadar')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('y', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleScale(i) - Math.PI / 2))
      .text((d) => d)
      .call(this.wrapFunction, cfg.wrapWidth, cfg.lineHeight);
    const radarLine = d3.lineRadial<{ axis: string, value: number }>()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(d.value))
      .angle((d, i) => angleScale(i));

    if (cfg.roundStrokes) {
      radarLine.curve(d3.curveCardinalClosed);
    }

    const sData = choose2[0] === choose2[1] ? data : [data[choose2[0]], data[choose2[1]]];

    const blobWrapper = g.selectAll('.radarWrapper')
      .data(sData)
      .enter().append('g')
      .attr('data-index', (d, i) => i)
      .attr('class', 'radarWrapper');
    blobWrapper
      .append('path')
      .attr('class', 'radarArea')
      .attr('d', (d) => radarLine(d))
      .style('fill', (d, i) => cfg.colour(i))
      .style('fill-opacity', cfg.opacityArea)
      .on('mouseover', (d, i, jj) => {
        // Dim all blobs
        d3.selectAll('.radarArea')
          .transition().duration(200)
          .style('fill-opacity', 0.1);
        // Bring back the hovered over blob
        d3.select(jj[i])
          .transition().duration(200)
          .style('fill-opacity', 0.7);
      })
      .on('mouseout', () => d3.selectAll('.radarArea')
        .transition().duration(200)
        .style('fill-opacity', cfg.opacityArea)
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
      .attr('cx', (d, i) => rScale(+d.value) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('cy', (d, i) => rScale(+d.value) * Math.sin(angleScale(i) - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.colour(+(<HTMLSelectElement>(j[i]).parentNode).getAttribute('data-index')))
      .style('fill-opacity', 0.8);
    const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
      .data(sData)
      .enter().append('g')
      .attr('data-index', (d, i) => i)
      .attr('class', 'radarCircleWrapper');
    blobCircleWrapper.selectAll('.radarInvisibleCircle')
      .data((d) => d)
      .enter().append('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', cfg.dotRadius * 1.1)
      .attr('cx', (d, i) => rScale(+d.value) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('cy', (d, i) => rScale(+d.value) * Math.sin(angleScale(i) - Math.PI / 2))
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
  stockbars = (DATA: { axis: string, value: number }[], ww: number, hh: number,
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
      .on('mousemove', (d) => tooltip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px').style('display', 'inline-block')
        .html(`<i class="fa fa-gears leafy"></i>${d.axis}<br>weight:${d.value}`))
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
