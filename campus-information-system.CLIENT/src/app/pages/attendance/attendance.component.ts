import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"

interface AttendanceRecord {
  date: string
  time: string
  status: "Present" | "Late" | "Absent"
}

@Component({
  selector: "app-attendance",
  imports: [CommonModule],
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"],
})
export class AttendanceComponent implements OnInit {
  // Attendance statistics
  presentPercentage = 92
  latePercentage = 6
  absentPercentage = 2

  // Monthly overview
  attendanceRate = 90
  daysPresent = 18
  totalSchoolDays = 20

  // Recent attendance records
  recentAttendance: AttendanceRecord[] = [
    { date: "February 27, 2024", time: "7:30 AM", status: "Present" },
    { date: "February 26, 2024", time: "7:25 AM", status: "Present" },
    { date: "February 23, 2024", time: "7:45 AM", status: "Late" },
    { date: "February 22, 2024", time: "7:28 AM", status: "Present" },
  ]

  constructor() {}

  ngOnInit(): void {
    // Initialize component data or fetch from service
  }

  // Method to handle search
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value
    console.log("Searching for:", searchTerm)
    // Implement search functionality
  }

  // Method to navigate back
  goBack(): void {
    // Implement navigation logic
    console.log("Navigating back")
  }

  // Method to get status class based on attendance status
  getStatusClass(status: string): string {
    switch (status) {
      case "Present":
        return "status-present"
      case "Late":
        return "status-late"
      case "Absent":
        return "status-absent"
      default:
        return ""
    }
  }
}
