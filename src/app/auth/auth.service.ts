import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../core/model/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static isAuthenticated: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  get authStatus(): boolean {
    return AuthService.isAuthenticated;
  }

  set authStatus(status: boolean) {
    AuthService.isAuthenticated = status;
  }

  public async login(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'> | false> {
    const userFound = await this.userService.findUser(email);

    if (userFound) {
      const { password: actualPassword, ...restUser } = userFound;
      if (actualPassword === password) {
        this.authStatus = true;
        localStorage.setItem(
          'loggedInUser',
          this.authStatus ? 'true' : 'false'
        );

        return restUser;
      }
    }
    return false;
  }
  async register(user: User): Promise<User | false> {
    this.userService.addUser(user);
    return user;
  }

  async logout(): Promise<void> {
    this.authStatus = false;
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/auth/login']);
  }
}
