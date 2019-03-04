import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeesService} from '../../services/employees.service';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.less']
})
export class LoginPopupComponent implements OnInit {

  loginPopup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private matDialogRef: MatDialogRef<LoginPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.loginPopup = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.employeesService.logIn(this.loginPopup.value.login, this.loginPopup.value.password).then(() => {
      this.matDialogRef.close();
    });
  }
}
