import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Employee, STANDARD_IMAGE} from '../Employee';
import {FormBuilder} from '@angular/forms';
import {EmployeesService} from '../employees.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {MatDialog, MatDialogRef} from '@angular/material';
import {EmployeeEditComponent} from '../employee-edit/employee-edit.component';

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private location: Location,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    let id = +this.route.snapshot.paramMap.get('id');
    if (!id) {
      id = 1;
    }
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
      this.noEmployeeById = true;
      this.cdr.detectChanges();
    });
  }

  onEdit(employee: Employee) {
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
    });
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
