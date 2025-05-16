import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { By } from "@angular/platform-browser"
import { AttendanceComponent } from "./attendance.component"

describe("AttendanceComponent", () => {
  let component: AttendanceComponent
  let fixture: ComponentFixture<AttendanceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendanceComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should display the institute name", () => {
    const titleElement = fixture.debugElement.query(By.css(".institute-name"))
    expect(titleElement.nativeElement.textContent).toContain("BANSUD INSTITUTE, INC.")
  })

  it("should display attendance statistics", () => {
    const presentElement = fixture.debugElement.query(By.css(".present-card .status-percentage"))
    const lateElement = fixture.debugElement.query(By.css(".late-card .status-percentage"))
    const absentElement = fixture.debugElement.query(By.css(".absent-card .status-percentage"))

    expect(presentElement.nativeElement.textContent).toContain("92")
    expect(lateElement.nativeElement.textContent).toContain("6")
    expect(absentElement.nativeElement.textContent).toContain("2")
  })

  it("should display the correct number of recent attendance records", () => {
    const attendanceItems = fixture.debugElement.queryAll(By.css(".attendance-item"))
    expect(attendanceItems.length).toBe(4)
  })

  it("should apply the correct status class based on attendance status", () => {
    expect(component.getStatusClass("Present")).toBe("status-present")
    expect(component.getStatusClass("Late")).toBe("status-late")
    expect(component.getStatusClass("Absent")).toBe("status-absent")
  })

  it("should call goBack method when back button is clicked", () => {
    const goBackSpy = spyOn(component, "goBack")
    const backButton = fixture.debugElement.query(By.css(".back-button"))
    backButton.triggerEventHandler("click", null)
    expect(component.goBack).toHaveBeenCalled()
  })

  it("should call onSearch method when input changes", () => {
    const onSearchSpy = spyOn(component, "onSearch")
    const searchInput = fixture.debugElement.query(By.css(".search-input"))
    searchInput.nativeElement.value = "test"
    searchInput.nativeElement.dispatchEvent(new Event("input"))
    expect(component.onSearch).toHaveBeenCalled()
  })
})
