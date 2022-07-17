import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/model/user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit {
  public registerUser: User;

  constructor(private authService: AuthService, private router: Router) {
    this.registerUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
  }

  ngOnInit(): void {}

  public async onRegister() {
    const user = await this.authService.register(this.registerUser);
    if (user) {
      this.router.navigate(['/auth/login']);
    }
  }
}
