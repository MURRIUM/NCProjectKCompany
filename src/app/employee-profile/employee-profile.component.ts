import {Component, OnInit} from '@angular/core';
import {Employee} from '../Employee';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeesService} from '../employees.service';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.less']
})
export class EmployeeProfileComponent implements OnInit {
  employee: Employee;
  editEmployee: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.employeesService.getEmployee(id).subscribe(employee => this.employee = employee);
    if (this.employee) {
      this.editEmployee = this.fb.group({
        name: [this.employee.name, Validators.required],
        position: [this.employee.position, Validators.required],
        birthday: [this.employee.birthday.slice(0, 10), Validators.required],
        status: [this.employee.status]
      });
    } else {
      this.editEmployee = this.fb.group({
        name: ['', Validators.required],
        position: ['', Validators.required],
        birthday: ['', Validators.required],
        status: ['']
      });
    }
  }

  onSubmit() {
    if (this.editEmployee.valid) {
      if (!this.employee) {
        this.employee = new Employee();
        this.employeesService.lastId += 1;
        this.employee.id = this.employeesService.lastId;
      }
      this.employee.name = this.editEmployee.value.name;
      this.employee.position = this.editEmployee.value.position;
      this.employee.birthday = this.editEmployee.value.birthday;
      this.employee.status = !!this.editEmployee.value.status;
      this.employeesService.save(this.employee).catch((e) => { console.log(e); });
    }
    this.location.back();
  }

  onDelete() {
    if (this.employee) {
      this.employeesService.delete(this.employee);
      this.location.back();
    } else {
      this.editEmployee = this.fb.group({
        name: ['', Validators.required],
        position: ['', Validators.required],
        birthday: ['', Validators.required],
        status: ['']
      });
      this.employee = null;
    }
  }
}
