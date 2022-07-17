import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  public email = '';
  public password = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  public async onLogin() {
    if (this.email && this.password) {
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        this.router.navigate(['/report']);
      }
    }
  }
}
