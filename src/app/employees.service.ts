import {Injectable} from '@angular/core';
import {Employee} from './Employee';
import {User} from './user';

const EmployeesOfCompany = Backendless.Data.of('CompanyTable');
const queryBuilder = Backendless.DataQueryBuilder.create();

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor() { }

  public lastId: number;
  public employees: Employee[] = [];
  public users: Employee[] = [];
  public profileEmployee: Employee;
  public loggedUser: User;

  checkLoginUser(): Promise<void> {
    return Backendless.UserService.getCurrentUser()
      .then( ( currentUser: User ) => {
        this.loggedUser = currentUser;
        return this.loadSingleEmployee(currentUser.id).then(() => {
          this.loggedUser.profile = this.profileEmployee;
        });
      });
  }

  logIn(login: string, password: string): Promise<void> {
    return Backendless.UserService.login(login, password, true).then((loggedInUser: User) => {
      this.loggedUser = loggedInUser;
      return this.loadSingleEmployee(loggedInUser.id).then(() => {
        this.loggedUser.profile = this.profileEmployee;
      });
    });
  }

  logOut(): Promise<void> {
    this.loggedUser = null;
    return Backendless.UserService.logout();
  }

  saveImage(image: File): Promise<void> {
    return Backendless.Files.upload(image, 'profileImages', true);
  }

  deleteImage(imageUrl: string): Promise<number> {
    return Backendless.Files.remove(imageUrl);
  }

  registerNewUser(user: User): Promise<User> {
    return Backendless.UserService.register<User>(user);
  }

  save(employee: Employee): Promise<void> {
    return EmployeesOfCompany.save<Employee>(employee).then(() => {this.getId(); });
  }

  delete(employee: Employee): Promise<void> {
    this.deleteImage(employee.image);
    return EmployeesOfCompany.remove(employee).then(() => {this.getId(); }).catch((e) => { console.log(e); });
  }

  getId(): Promise<void> {
    queryBuilder.setSortBy('id DESC');
    queryBuilder.setPageSize(1);
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employee: Employee[]) => {
      this.lastId = employee[0].id;
    });
  }

  loadUsers(): Promise<void> {
    queryBuilder.setPageSize(100);
    queryBuilder.setSortBy('id');
    queryBuilder.setWhereClause(`hasLogin = true`);
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employees: Employee[]) => {
      this.users = employees;
      queryBuilder.setPageSize(20);
      queryBuilder.setWhereClause('');
    });
  }

  loadAll(): Promise<void> {
    queryBuilder.setPageSize(20);
    queryBuilder.setSortBy('id');
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employees: Employee[]) => {
      this.employees = employees;
    }).finally(() => this.getId());
  }

  loadStartingFrom(id: number): Promise<void> {
    queryBuilder.setPageSize(20);
    queryBuilder.setSortBy('id');
    queryBuilder.setWhereClause(`id >= ${id}`);
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employees: Employee[]) => {
      this.employees = employees;
      queryBuilder.setWhereClause('');
    });
  }

  loadSingleEmployee(id: number): Promise<void> {
    queryBuilder.setWhereClause(`id = ${id}`);
    return EmployeesOfCompany.find<Employee>(queryBuilder).then((employees: Employee[]) => {
      this.profileEmployee = employees[0];
      queryBuilder.setWhereClause('');
    }).catch(e => console.log(e));
  }
}
