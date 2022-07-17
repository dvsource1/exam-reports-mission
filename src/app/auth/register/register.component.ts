import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/model/ui/user';
import { AuthService } from '../auth.service';

/**
 * Register view component
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent {
  public registerUser: User;

  constructor(private authService: AuthService, private router: Router) {
    this.registerUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
  }

  /**
   * trigger auth register
   */
  public async onRegister() {
    const user = await this.authService.register(this.registerUser);
    if (user) {
      this.router.navigate(['/auth/login']);
    }
  }
}
