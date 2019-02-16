import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EmployeesService} from '../employees.service';
import {MatDialog} from '@angular/material';
import {Employee} from '../Employee';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.less']
})
export class AdminPanelComponent implements OnInit {

  constructor(
    private employeesService: EmployeesService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.employeesService.loadUsers().then(() => {
      this.cdr.detectChanges();
    });
  }

  get users(): Employee[] {
    return this.employeesService.users;
  }

  changeRights(user: Employee) {
    user.admin ? user.admin = false : user.admin = true;
    this.employeesService.save(user).then(() => {
      this.ngOnInit();
    });
  }
}
