import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
}

interface ScheduleItem {
  id: number;
  date: Date;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  color: 'primary' | 'secondary';
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ScheduleComponent implements OnInit {
  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays: string[] = ['Mo', 'Tu', 'Wed', 'Th', 'Fr', 'Sa', 'Su'];
  scheduleData: ScheduleItem[] = [];
  selectedDateSchedule: ScheduleItem[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initialize with the current month
    this.generateCalendarDays(this.currentDate);
    
    // Load mock schedule data
    this.loadScheduleData();
    
    // Set initial selected date to today
    this.selectDate(this.selectedDate);
  }

  /**
   * Generate calendar days for the given month
   */
  generateCalendarDays(date: Date): void {
    this.calendarDays = [];
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    
    // Get the last day of the month
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Get the day of the week of the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Adjust for Monday as first day of week
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Add days from previous month
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const prevMonthDay = prevMonth.getDate() - i;
      const prevMonthDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthDay);
      
      this.calendarDays.push({
        date: prevMonthDate,
        day: prevMonthDay,
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const currentMonthDate = new Date(date.getFullYear(), date.getMonth(), i);
      
      this.calendarDays.push({
        date: currentMonthDate,
        day: i,
        isCurrentMonth: true
      });
    }
    
    // Add days from next month
    const totalDaysToShow = 42; // 6 rows of 7 days
    const daysFromNextMonth = totalDaysToShow - this.calendarDays.length;
    
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
      
      this.calendarDays.push({
        date: nextMonthDate,
        day: i,
        isCurrentMonth: false
      });
    }
  }

  /**
   * Load mock schedule data
   */
  loadScheduleData(): void {
    // Create a date for January 7, 2025 (as shown in the UI)
    const baseDate = new Date(2025, 0, 7); // January is 0
    
    // Mock data for the schedule
    this.scheduleData = [
      {
        id: 1,
        date: baseDate,
        subject: 'Mathematics',
        teacher: 'Ma\'am Mariza Rada',
        startTime: '7:30 AM',
        endTime: '8:00 AM',
        color: 'primary'
      },
      {
        id: 2,
        date: baseDate,
        subject: 'English',
        teacher: 'Ma\'am Hazel Jane Guno',
        startTime: '8:30 AM',
        endTime: '10:00 AM',
        color: 'secondary'
      },
      {
        id: 3,
        date: baseDate,
        subject: 'Science',
        teacher: 'Sir Vince Audrey Rey',
        startTime: '10:30 AM',
        endTime: '12:00 NN',
        color: 'primary'
      },
      {
        id: 4,
        date: baseDate,
        subject: 'Filipino',
        teacher: 'Sir Justin Lhei Macalipay',
        startTime: '1:00 PM',
        endTime: '2:30 PM',
        color: 'secondary'
      },
      // Add more schedule items for other dates
      {
        id: 5,
        date: new Date(2025, 0, 8), // January 8, 2025
        subject: 'Physical Education',
        teacher: 'Sir Mark Santos',
        startTime: '7:30 AM',
        endTime: '9:00 AM',
        color: 'primary'
      },
      {
        id: 6,
        date: new Date(2025, 0, 8), // January 8, 2025
        subject: 'Social Studies',
        teacher: 'Ma\'am Elena Cruz',
        startTime: '9:30 AM',
        endTime: '11:00 AM',
        color: 'secondary'
      }
    ];
  }

  /**
   * Select a date and update the schedule
   */
  selectDate(date: Date): void {
    this.selectedDate = new Date(date);
    this.updateSchedule();
  }

  /**
   * Update the schedule based on the selected date
   */
  updateSchedule(): void {
    this.selectedDateSchedule = this.scheduleData.filter(item => 
      this.isSameDay(item.date, this.selectedDate)
    );
  }

  /**
   * Check if a date is the selected date
   */
  isSelectedDate(date: Date): boolean {
    return this.isSameDay(date, this.selectedDate);
  }

  /**
   * Check if a date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  /**
   * Check if two dates are the same day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  /**
   * Navigate to the previous month
   */
  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendarDays(this.currentDate);
  }

  /**
   * Navigate to the next month
   */
  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendarDays(this.currentDate);
  }
}