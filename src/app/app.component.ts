import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

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
  constructor(
    private appService: AppService,
    public authService: AuthService,
    public router: Router
  ) {
    this.appService.init();
  }

  ngOnInit(): void {}
}
