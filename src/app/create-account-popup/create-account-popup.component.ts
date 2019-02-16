import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeesService} from '../employees.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../user';
import {Employee} from '../Employee';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-account-popup',
  templateUrl: './create-account-popup.component.html',
  styleUrls: ['./create-account-popup.component.less']
})
export class CreateAccountPopupComponent implements OnInit {

  employee: Employee;
  loginEmployee: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private matDialogRef: MatDialogRef<CreateAccountPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loginEmployee = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
    const id = this.data.employee.id;
    this.employeesService.getEmployeeFromServer(id).finally(() => {
      this.employee = this.employeesService.profileEmployee;
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (this.loginEmployee.valid) {
      let newUser: User;
      newUser = new User();
      newUser.id = this.employee.id;
      newUser.name = this.loginEmployee.value.login;
      newUser.password = this.loginEmployee.value.password;
      this.employeesService.registerNewUser(newUser).then(() => {
        this.employee.hasLogin = true;
        this.employeesService.save(this.employee).then(() => {
          this.matDialogRef.close();
        });
      });
    }
  }
}
