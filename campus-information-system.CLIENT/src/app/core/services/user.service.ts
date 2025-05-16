import { computed, Injectable, signal } from '@angular/core';
import { IUser } from '../interfaces/userInterface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Use signal for reactive state management
  private readonly user = signal<IUser | null>(null);  
  private _userSubject = new BehaviorSubject<IUser | null>(null);

  // Computed values based on the signal (automatically updates when 'user' changes)
  authorized = computed(() => this.user() !== null);  
  userId = computed(() => this.user()?._id);  

  // Observable to subscribe to the current user
  user$ = this._userSubject.asObservable();

  constructor() {}

  // Set user after login
  setUser(user: IUser): void {
    this.user.set(user);  // Update the signal state
    this._userSubject.next(user);  // Update the BehaviorSubject as well
  }

  // Clear user on logout
  clearUser(): void {
    this.user.set(null);  // Clear the signal state
    this._userSubject.next(null);  // Clear the BehaviorSubject state
  }

  // Optional: Get current user value
  getCurrentUser(): IUser | null {
    return this._userSubject.getValue();  // Access the BehaviorSubject value directly
  }
}
