import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  display = 'Radar Plot and its data shown in bar charts and tables';
  type: string;
  stocks = 21;
  optType = ['long', 'short', 'KAG'].reverse();
  changeLs(dd: string) {
    this.type = dd;
  }
}
