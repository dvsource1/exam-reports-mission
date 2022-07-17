import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';

/**
 * Responsible for initializing app
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@Injectable()
export class AppService {
  constructor(private authService: AuthService) {
    // set auth status
    const loggedInUser = localStorage.getItem('loggedInUser');
    this.authService.authStatus = loggedInUser === 'true';
  }

  public init(): void {}
}
