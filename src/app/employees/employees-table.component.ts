import {Component, OnInit} from '@angular/core';
import {EmployeesService} from '../employees.service';
import {Employee} from '../Employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees.component.less']
})
export class EmployeesTableComponent implements OnInit {
  current = 0;
  nextDisabled = true;
  prevDisabled = true;
  prevId: number;
  constructor(private employeesService: EmployeesService) { }

  ngOnInit() {
    this.employeesService.getId().finally(() => {
      this.employeesService.loadAll().finally(() => {
        if (this.employees[this.employees.length - 1].id !== this.employeesService.lastId) {
          this.nextDisabled = false;
        }
      });
    });
  }

  get employees(): Employee[] {
    return this.employeesService.employees;
  }

  onNext() {
    if (this.prevDisabled) {
      this.prevDisabled = false;
    }
    this.prevId = this.employees[0].id;
    this.current = this.employees[19].id + 1;
    this.employeesService.loadFrom(this.current).then(() => {
      if (this.employees[this.employees.length - 1].id === this.employeesService.lastId) {
        this.nextDisabled = true;
      }
    });
  }

  onPrev() {
    if (this.nextDisabled) {
      this.nextDisabled = false;
    }
    this.current = this.prevId;
    this.employeesService.loadFrom(this.current).finally(() => {
      if (this.employees[0].id === 1) {
        this.prevDisabled = true;
      }
    });
  }
}
