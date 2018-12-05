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

  displayData: any;
  getKey = '';
  itemData = ['radarData', 'results'];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.chooseData(this.itemData[0]);
  }
  chooseData(dd: string) {
    d3.select('app-users').selectAll('svg').remove();
    this.getKey = dd;
    this.userService.postResult().subscribe(res => {
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
      });
    this.userService
      .getUsers(this.getKey)
      .subscribe(data => {
        this.displayData = data;
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
          const margin = { top: 150, right: 150, bottom: 150, left: 150 }, ww = 1000, hh = 1000,
            width = ww - margin.left - margin.right,
            height = hh - margin.top - margin.bottom,
            radarBlobColour = d3.scaleOrdinal<number, string>().range(['rgb(255,50,50)', 'rgb(50,255,50)', 'rgb(50,50,255)']),
            radarChartOptions = {
              w: width, h: height, margin: margin, maxValue: 0.1,
              levels: 5, roundStrokes: true, colour: radarBlobColour
            };
          this.RadarChart('app-users', data, radarChartOptions);
          data.forEach((ddd) => {
            this.stockbars(ddd, ww * 0.5, hh * 0.5, 2000);
            this.simpleDisplay(ddd);
          });
        }
      }, res => {
        console.log(res);
      });
  }

  simpleDisplay(displayData: any) {
    const nDat = displayData.length, ww = 350,
      base = d3.select('app-users').append('svg')
        .attr('width', ww)
        .attr('height', (nDat + 2) * 21);
    // base = d3.select('app-users').append('svg').attr('viewBox', `0 0 ${ww} ${(nDat + 2) * 21}`);
    base.append('text')
      .attr('x', 5)
      .attr('y', 23)
      .attr('transform', `translate(${10},${0})`)
      .text(() => {
        let back = '';
        Object.keys(displayData[0]).forEach((k) => back += `${k} `);
        return back;
      })
      .attr('class', 'users');
    base.append('rect')
      .attr('class', 'users')
      .attr('width', ww - 10)
      .attr('height', 24)
      .attr('x', 5)
      .attr('y', 3);
    base.selectAll('inner').data(displayData).enter().append('text')
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
      .attr('width', ww - 10)
      .attr('height', nDat * 21)
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

    const allAxis = (data[0].map((i) => i.axis)),	// Names of each axis
      total = allAxis.length,					// The number of different axes
      radius = Math.min(cfg.w / 2, cfg.h / 2), 	// Radius of the outermost circle
      percentFormat = d3.format('.0%'),			 	// Percentage formatting
      angleSlice = Math.PI * 2 / total;		// The width in radians of each "slice"

    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    const svg = d3.select(id).append('svg'), doView = true;

    if (doView) {
      svg.attr('viewBox', `0 0 ${cfg.w + cfg.margin.left + cfg.margin.right} ${cfg.h + cfg.margin.top + cfg.margin.bottom}`)
        .attr('class', 'radar' + id);
    } else {
      svg
        .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
        .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
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

    axisGrid.selectAll('.levels')
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d) => radius / cfg.levels * d)
      .style('fill-opacity', cfg.opacityCircles)
      .style('stroke-opacity', cfg.opacityCircles)
      .style('filter', 'url(#glow)');

    axisGrid.selectAll('.axisLabel')
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append('text')
      .attr('class', 'axisRadar')
      .attr('x', 4)
      .attr('y', (d) => -d * radius / cfg.levels)
      .attr('dy', '0.4em')
      .text((d, i) => percentFormat(maxValue * d / cfg.levels));


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
        const HERE = d3.select(j[i]), extension = 1.13;
        HERE.attr('x2', () => rScale(maxValue * extension) * Math.cos(angleSlice * i - Math.PI / 2) * t);
        HERE.attr('y2', () => rScale(maxValue * extension) * Math.sin(angleSlice * i - Math.PI / 2) * t);
      })
      .attr('class', 'line');

    axis.append('text')
      .attr('class', 'legendRadar')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => d)
      .call(this.wrapFunction, cfg.wrapWidth, cfg.lineHeight);

    const radarLine = d3.lineRadial<{ axis: string, value: number }>()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    if (cfg.roundStrokes) {
      radarLine.curve(d3.curveCardinalClosed);
    }
    const blobWrapper = g.selectAll('.radarWrapper')
      .data(data)
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
      .attr('cx', (d, i) => rScale(+d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(+d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.colour(+(d3.select(<HTMLSelectElement>(j[i]).parentNode).attr('data-index'))))
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
      .attr('cx', (d, i) => rScale(+d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(+d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.colour(+(d3.select(<HTMLSelectElement>(j[i]).parentNode).attr('data-index'))))
      .style('pointer-events', 'all')
      .on('mouseover', (d, i, j) => {
        const newX = parseFloat(d3.select(j[i]).attr('cx')) - 10,
          newY = parseFloat(d3.select(j[i]).attr('cy')) - 10,
          fill = d3.select(j[i]).style('fill');
        localTiptool
          .attr('x', newX)
          .attr('y', newY)
          .style('fill', 'none')
          .style('opacity', 1)
          .text(percentFormat(+d.value))
          .transition().duration(200)
          .style('fill', fill);
      })
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
    durationtime: number, xText = '', yText = '') => {
    const svg = d3.select('app-users').append('svg')
      .attr('width', ww)
      .attr('height', hh).append('g'),
      chart = svg.append('g'),
      scaleAll = 1;
    if (xText.length < 1) { xText = 'Weight'; }
    if (yText.length < 1) { yText = 'Class'; }
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
          .attr('x', -10 * scaleAll).attr('y', -10 * scaleAll).attr('transform', 'rotate(-70)');
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
      , y = d3.scaleLinear().range([height, 0])
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
        .style('display', 'inline-block').html(`<a class="fa fa-gears leafy"></a>${d.axis}<br>weight:${d.value}`))
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
    .attr('id', (d) => d.value > 0 ? 'weightSinglePlus' : 'weightSingleMinus')
    .on('mousemove', (d) => tooltip.style('left', d3.event.pageX - 50 + 'px')
        .style('top', d3.event.pageY - 70 + 'px').style('display', 'inline-block')
        .html(`<app-icon><fa><i class="fa fa-gears leafy"></i></fa></app-icon>${d.axis}<br>weight:${d.value}`))
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
