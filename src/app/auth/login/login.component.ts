import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * Login view component
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  public email = '';
  public password = '';

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * trigger auth login
   * navigate to feature route if "success"
   */
  public async onLogin() {
    if (this.email && this.password) {
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        this.router.navigate(['/report']);
      }
    }
  }
}
