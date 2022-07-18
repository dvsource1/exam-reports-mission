/**
 * Auth user UI model
 * @author <virajkaush@gmail.com>
 * @since  2022.07.17
 */
export interface User {
  email: string;
  password: string;

  firstName: string;
  lastName: string;
}

export type LoginUser = Pick<User, 'email' | 'password'>;

export type UserWithoutPassword = Omit<User, 'password'>;
