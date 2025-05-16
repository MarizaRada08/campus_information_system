import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
    
  snackbarVisible = false;
  snackbarMessage = '';
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  showSnackbar(message: string) {
    this.snackbarMessage = `${message} clicked`;
    this.snackbarVisible = true;
  }

  closeSnackbar() {
    this.snackbarVisible = false;
  }
}
