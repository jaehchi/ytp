import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ytp';
  arr= [1,2,3,4, 5]

  constructor () {
    
  }
  public save () {
    console.log('hi', chrome)
  }
}
