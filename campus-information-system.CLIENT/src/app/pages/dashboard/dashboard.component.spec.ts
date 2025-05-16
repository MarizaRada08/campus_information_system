import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common'; // for ngFor in the template
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu visibility when hamburger icon is clicked', () => {
    const menu = fixture.debugElement.query(By.css('#menu'));
    const icon = fixture.debugElement.query(By.css('.fas.fa-bars'));

    // Initially, the menu should not be visible
    expect(menu.nativeElement.classList.contains('active')).toBeFalse();

    // Simulate a click on the hamburger icon to open the menu
    icon.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    // After the click, the menu should be visible
    expect(menu.nativeElement.classList.contains('active')).toBeTrue();

    // Simulate another click to close the menu
    icon.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    // After the second click, the menu should be hidden again
    expect(menu.nativeElement.classList.contains('active')).toBeFalse();
  });
});
