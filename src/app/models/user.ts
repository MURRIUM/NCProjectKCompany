import {Employee} from './Employee';

export class User extends Backendless.User {
  id: number;
  profile: Employee;
  name?: string;
}
