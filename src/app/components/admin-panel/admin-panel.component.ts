import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EmployeesService} from '../../services/employees.service';
import {Employee} from '../../models/Employee';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.less']
})
export class AdminPanelComponent implements OnInit {

  constructor(
    private employeesService: EmployeesService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.employeesService.loadUsers().then(() => {
      this.cdr.detectChanges();
    });
  }

  get users(): Employee[] {
    return this.employeesService.users;
  }

  changeRights(user: Employee): void {
    user.admin ? user.admin = false : user.admin = true;
    this.employeesService.save(user).then(() => {
      this.ngOnInit();
    });
  }
}
