import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from './core/services/user.service';
import { NavbarComponent } from "./pages/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly _userService = inject(UserService);
  private authSubscription: Subscription = new Subscription();

  title = 'campus-information-system';
  Authorized = this._userService.authorized;

  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // ✅ Check token on load
    this.isLoggedIn = this.authService.isLoggedIn();

    // Subscribe to authentication state
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (authStatus: boolean) => {
        this.isLoggedIn = authStatus;
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
