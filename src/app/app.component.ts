import { Component } from '@angular/core';
import { type } from 'os';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  display = 'Radar Plot and its data shown in bar charts and tables';
  type = 'short';
  stocks = 21;
  optType = ['long', 'short', 'KAG'].reverse();
  getType() {
    console.log(this.type);
    return this.type;
  }
  changeType(dd: string) {
    console.log(dd);
    this.type = dd;
  }
  changeStocks(dd: number) {
    this.stocks = dd;
  }
}
