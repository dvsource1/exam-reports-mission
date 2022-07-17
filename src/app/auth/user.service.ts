import { Injectable } from '@angular/core';
import * as Joi from 'joi';
import { User } from '../core/model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private USERS: User[] = [
    {
      email: 'virajkaush@gmail.com',
      firstName: 'Viraj',
      lastName: 'Kaushalye',
      password: `1234`,
    },
  ];

  constructor() {}

  public async addUser(user: User): Promise<void> {
    this.USERS = [...this.USERS, user];
  }

  public async findUser(email: string): Promise<User | undefined> {
    return this.USERS.find((user) => user.email === email);
  }

  public async validateUser(user: User): Promise<any> {
    const schema = Joi.object<User>({
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

      firstName: Joi.string().min(1).max(100).required(),

      lastName: Joi.string().min(1).max(100).required(),

      email: Joi.string().email(),
    });

    return schema.validateAsync(user);
  }
}
