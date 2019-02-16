import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Employee, STANDARD_IMAGE} from '../Employee';
import {FormBuilder} from '@angular/forms';
import {EmployeesService} from '../employees.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {MatDialog, MatDialogRef} from '@angular/material';
import {EmployeeEditComponent} from '../employee-edit/employee-edit.component';
import {CreateAccountPopupComponent} from '../create-account-popup/create-account-popup.component';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./employee-profile.component.less']
})
export class EmployeeProfileComponent implements OnInit {
  @Input() employee: Employee;
  standardImg = STANDARD_IMAGE;
  noEmployeeById = false;
  changingProfile = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private location: Location,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.getEmployee(id);
  }

  getEmployee(id: number) {
    this.employeesService.getEmployeeFromServer(id).then(() => {
      this.employee = this.employeesService.profileEmployee;
      if (this.employee.image) {
        this.standardImg = this.employee.image;
      } else {
        this.standardImg = STANDARD_IMAGE;
      }
      this.cdr.detectChanges();
    }).catch((e) => {
      console.error(e);
      this.noEmployeeById = true;
      this.cdr.detectChanges();
    });
  }

  checkLogin(): boolean {
    if (this.changingProfile) {
      return false;
    }
    if (this.employeesService.loggedUser && this.employeesService.loggedUser.profile) {
      if (this.employeesService.loggedUser.profile.admin || this.employeesService.loggedUser.id === this.employee.id) {
        return true;
      }
    }
    return false;
  }

  createAccount() {
    this.changingProfile = true;
    this.cdr.detectChanges();
    const dialogRef = this.dialog.open(CreateAccountPopupComponent, {data: {employee: this.employee}});

    dialogRef.afterClosed().subscribe(() => {
      this.changingProfile = false;
      this.ngOnInit();
    });
    this.changingProfile = false;
  }

  onEdit(employee: Employee) {
    this.changingProfile = true;
    this.cdr.detectChanges();
    let dialogRef: MatDialogRef<EmployeeEditComponent>;
    if (employee) {
      dialogRef = this.dialog.open(EmployeeEditComponent, {data: {employee: employee}});
    } else {
      dialogRef = this.dialog.open(EmployeeEditComponent, {data: {employee: new Employee()}});
    }
    dialogRef.afterClosed().subscribe((close) => {
      this.getEmployee(this.employee.id);
      if (close) {
        this.employeesService.loadAll();
        this.location.back();
      }
      this.changingProfile = false;
    });
    this.changingProfile = false;
  }

  onDelete() {
    if (this.employee) {
      this.employeesService.delete(this.employee).finally(() => {
        this.employeesService.loadAll().finally(() => {
          this.location.back();
        });
      });
    }
    this.employee = null;
  }
}
