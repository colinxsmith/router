import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  display = 'Radar Plot and its data shown in bar charts and tables';
  type = 'factor';
  factorWants: number[] = [];
  stocks = 21;
  optType = ['long', 'short', 'KAG', 'factor'].reverse();
  changeType(dd: string) {
    console.log(dd);
    this.type = dd;
  }
  changeStocks(dd: number) {
    this.stocks = dd;
  }
  changeWants(dd: number[]) {
    this.factorWants = dd;
  }
}
