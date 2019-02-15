import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {EmployeesService} from './employees.service';
import {MatDialog} from '@angular/material';
import {LoginPopupComponent} from './login-popup/login-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private employeesService: EmployeesService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.employeesService.checkLoginUser().finally(() => {
      this.cdr.detectChanges();
    });
  }

  openLoginPopup() {
    const dialogRef = this.dialog.open(LoginPopupComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  logOut() {
    this.employeesService.logOut().finally(() => {
      this.cdr.detectChanges();
    });
  }
}
