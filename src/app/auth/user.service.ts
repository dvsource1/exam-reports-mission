import { Injectable } from '@angular/core';
import * as Joi from 'joi';
import { LoginUser, User } from '../core/model/ui/user';

/**
 * Responsible handing users
 * work as a fake users API service
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * users store / database
   */
  private USERS: User[] = [
    {
      email: 'virajkaush@gmail.com',
      firstName: 'Viraj',
      lastName: 'Kaushalye',
      password: `1234`,
    },
  ];

  constructor() {}

  /**
   * add new user
   * @param   {User} user new user
   * @returns {Promise<void>}
   */
  public async addUser(user: User): Promise<User | null> {
    const found = await this.findUser(user.email);
    if (!found) {
      this.USERS = [...this.USERS, user];
      return user;
    }
    return null;
  }

  /**
   * find a user by email
   * @param   {string} email email address
   * @returns {Promise<User | undefined>} found user or `undefined`
   */
  public async findUser(email: string): Promise<User | undefined> {
    return this.USERS.find((user) => user.email === email);
  }

  /**
   * validate new user
   * @param   {User} user new user
   * @returns {Promise<User | undefined>} validated user or `undefined`
   */
  public async validateNewUser(user: User): Promise<any> {
    const schema = Joi.object<User>({
      password: Joi.string()
        .min(4)
        .max(16)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

      firstName: Joi.string().min(1).max(100).required(),

      lastName: Joi.string().min(1).max(100).required(),

      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    });

    return schema.validateAsync(user);
  }

  public async validateLoginUser(user: LoginUser): Promise<any> {
    const schema = Joi.object<LoginUser>({
      password: Joi.string()
        .min(4)
        .max(16)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    });

    return schema.validateAsync(user);
  }
}
