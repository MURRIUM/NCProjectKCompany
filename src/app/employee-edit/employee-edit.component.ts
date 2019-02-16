import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Employee, STANDARD_IMAGE} from '../Employee';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeesService} from '../employees.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {User} from '../user';

// @ts-ignore
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.less']
})
export class EmployeeEditComponent implements OnInit {
  employee: Employee;
  editEmployee: FormGroup;
  @ViewChild('file') image;
  profileImage = STANDARD_IMAGE;
  isStandard = true;
  isNew = true;
  checkedNewLogin = false;

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    private matDialogRef: MatDialogRef<EmployeeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.editEmployee = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      birthday: ['', Validators.required],
      status: [''],
      commentary: [''],
    });

    if (this.data.employee.id) {
      const id = this.data.employee.id;
      this.employeesService.getEmployeeFromServer(id).finally(() => {
        this.employee = this.employeesService.profileEmployee;
        if (this.employee) {
          this.isNew = false;
          this.editEmployee = this.fb.group({
            name: [this.employee.name, Validators.required],
            position: [this.employee.position, Validators.required],
            birthday: [this.employee.birthday.slice(0, 10), Validators.required],
            status: [this.employee.status],
            commentary: [this.employee.commentary ? this.employee.commentary : '' ],
          });
        }
        if (this.employee.image) {
          this.profileImage = this.employee.image;
          this.isStandard = false;
        }
        this.cdr.detectChanges();
      });
    }
    this.cdr.detectChanges();
  }

  addImage() {
    this.image.nativeElement.click();
  }

  onImageAdded() {
    if (this.employee && this.employee.image) {
      this.onDeleteImage();
    }
    this.employeesService.saveImage(this.image.nativeElement.files[0])
      .then((imgUrl) => {
        // @ts-ignore
        this.profileImage = imgUrl.fileURL;
        this.isStandard = false;
        this.cdr.detectChanges();
      });
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
      this.employee.commentary = this.editEmployee.value.commentary;
      if (!this.isStandard) {
        this.employee.image = this.profileImage;
      }
      if (this.checkedNewLogin) {
        if (this.editEmployee.value.login !== '' && this.editEmployee.value.password !== '') {
          let newUser: User;
          newUser = new User();
          newUser.id = this.employee.id;
          newUser.name = this.editEmployee.value.login;
          newUser.password = this.editEmployee.value.password;
          this.employeesService.registerNewUser(newUser);
        }
      }
      this.employeesService.save(this.employee).then(() => this.employeesService.loadAll()).finally(() => {
        this.matDialogRef.close(false);
      });
    }
  }
  onDelete() {
    if (this.employee) {
      this.employeesService.delete(this.employee).finally(() => this.employeesService.loadAll());
      this.matDialogRef.close(true);
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

  onDeleteImage() {
    this.employeesService.deleteImage(this.profileImage).then(() => {
      if (this.employee) {
        this.employee.image = null;
      }
      this.profileImage = STANDARD_IMAGE;
      this.isStandard = true;
      this.cdr.detectChanges();
    });
  }
}
