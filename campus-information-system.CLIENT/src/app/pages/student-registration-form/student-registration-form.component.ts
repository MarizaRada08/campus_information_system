import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentService } from 'src/app/core/services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-registration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-registration-form.component.html',
  styleUrl: './student-registration-form.component.scss'
})
export class StudentRegistrationFormComponent {
    private readonly router = inject(Router);
  
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private studentService: StudentService) {
    this.registrationForm = this.fb.group({
      StudentStatus: ['', Validators.required],
      Strand: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      LastName: ['', Validators.required],
      FirstName: ['', Validators.required],
      MiddleName: [''],
      Address: ['', Validators.required],
      ContactNumber: ['', Validators.required],
      DateOfBirth: ['', Validators.required],
      Age: [null, Validators.required],
      Gender: ['', Validators.required],
      GradeLevel: ['', Validators.required],
      Section: ['', Validators.required],
      GuardianName: ['', Validators.required],
      GuardianContact: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.studentService.addStudent(this.registrationForm.value).subscribe({
        next: (res) => {
          console.log('Student added:', res);
          this.registrationForm.reset();
  
          // ✅ Navigate after success
          this.router.navigate(['pages/dashboard']); // palitan mo ng desired route
        },
        error: (err) => {
          console.error('Error adding student:', err);
        }
      });
    }
  }
}
