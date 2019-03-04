import {ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {EmployeesService} from './services/employees.service';
import {MatDialog} from '@angular/material';
import {LoginPopupComponent} from './components/login-popup/login-popup.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Employee} from './models/Employee';
import {User} from './models/user';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
    public dialog: MatDialog,
    private appRef: ApplicationRef,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.employeesService.checkLoginUser().then(() => {
      this.cdr.detectChanges();
    });
  }

  openLoginPopup(): void {
    const dialogRef = this.dialog.open(LoginPopupComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/main-page']);
      this.cdr.detectChanges();
    });
  }

  logOut(): void {
    this.employeesService.logOut().finally(() => {
      this.router.navigate(['/main-page']);
      this.cdr.detectChanges();
    });
  }
}
