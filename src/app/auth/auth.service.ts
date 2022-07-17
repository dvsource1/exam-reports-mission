import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserWithoutPassword } from '../core/model/ui/user';
import { UserService } from './user.service';

/**
 * Responsible handling auth related functions
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * is authenticated global state
   */
  private static isAuthenticated: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  /**
   * @returns authenticated status
   */
  get authStatus(): boolean {
    return AuthService.isAuthenticated;
  }

  /**
   * set authenticated status
   * @param {boolean} status
   */
  set authStatus(status: boolean) {
    AuthService.isAuthenticated = status;
  }

  /**
   * login by username & password
   * @param {string} email    email address
   * @param {string} password pass word
   * @returns {Promise<User | false>}
   */
  public async login(
    email: string,
    password: string
  ): Promise<UserWithoutPassword | false> {
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

  /**
   * register new user
   * @param {User} user new user
   * @returns {Promise<User | false>}
   */
  async register(user: User): Promise<User | false> {
    // TODO: implement user form validations
    this.userService.addUser(user);
    return user;
  }

  /**
   * logout current user
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    this.authStatus = false;
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/auth/login']);
  }
}
