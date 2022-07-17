import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
  constructor(private authService: AuthService) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    this.authService.authStatus = loggedInUser === 'true';
    console.log(localStorage);
  }

  public init(): void {}
}
