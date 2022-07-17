import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

/**
 * Bootstrap component
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  constructor(private appService: AppService) {
    this.appService.init();
  }

  ngOnInit(): void {}
}
