import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EmployeesService} from '../employees.service';
import {Employee} from '../Employee';
import {MatDialog, MatDialogRef} from '@angular/material';
import {EmployeeEditComponent} from '../employee-edit/employee-edit.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-employees',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.less']
})
export class EmployeesTableComponent implements OnInit {
  current = 0;
  nextDisabled = true;
  prevDisabled = false;
  prevId = 1;
  constructor(private employeesService: EmployeesService,
              public dialog: MatDialog,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.employeesService.loadAll().finally(() => {
      this.nextDisabled = this.employees[this.employees.length - 1].id === this.employeesService.lastId;
      this.prevDisabled = true;
      this.cdr.detectChanges();
    });
  }

  get employees(): Employee[] {
    return this.employeesService.employees;
  }

  openEditDialog(employee: Employee): void {
    let dialogRef: MatDialogRef<EmployeeEditComponent>;
    if (employee) {
      dialogRef = this.dialog.open(EmployeeEditComponent, {data: {employee: employee}});
    } else {
      dialogRef = this.dialog.open(EmployeeEditComponent, {data: {employee: new Employee()}});
    }
    dialogRef.afterClosed().subscribe(() => {
      this.employeesService.loadStartingFrom(this.current).then(() => {
        this.nextDisabled = this.employees[this.employees.length - 1].id === this.employeesService.lastId;
      }).finally(() => {
        this.cdr.detectChanges();
      });
    });
  }

  onNext(): void {
    if (this.prevDisabled) {
      this.prevDisabled = false;
    }
    this.prevId = this.employees[0].id;
    this.current = this.employees[19].id + 1;
    this.employeesService.loadStartingFrom(this.current).then(() => {
      if (this.employees[this.employees.length - 1].id === this.employeesService.lastId) {
        this.nextDisabled = true;
      }
      this.cdr.detectChanges();
    });
  }

  onPrev(): void {
    if (this.nextDisabled) {
      this.nextDisabled = false;
    }
    this.current = this.prevId;
    this.employeesService.loadStartingFrom(this.current).finally(() => {
      if (this.employees[0].id === 1) {
        this.prevDisabled = true;
      }
      this.cdr.detectChanges();
    });
  }
}
