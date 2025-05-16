import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    this.isLoggedIn = !!accessToken && !!refreshToken;

    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout();  // Clear tokens and user data
    this.router.navigate(['auth/login']);  // Redirect to login page
  }

  snackbarVisible = false;
  snackbarMessage = '';
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeSnackbar() {
    this.snackbarVisible = false;
  }
  
  goToNotifications() {
    this.router.navigate(['pages/notification']);
  }
}
