import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  type: string;
  stocks = 16;
  optType = ['long', 'short', 'KAG'].reverse();
  changeLs(dd: string) {
    this.type = dd;
  }
}
