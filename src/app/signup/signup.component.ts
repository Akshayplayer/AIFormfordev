import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {
  @Output() close = new EventEmitter<void>();
  myForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required])
  });
  

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.authService.signup(this.myForm.value)
      .subscribe({
        next: () => {
          alert('Signup successful! Please login.');
          this.close.emit();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Signup error:', err); // Log the full error object
          if (err.status === 400) {
            // Check if there's a specific error message from the backend
            if (err.error && typeof err.error === 'object') {
              // Assuming the backend sends validation errors in an object
              let errorMessage = 'Signup failed:';
              for (const key in err.error) {
                if (err.error.hasOwnProperty(key)) {
                  errorMessage += `\n${key}: ${err.error[key]}`;
                }
              }
              alert(errorMessage);
            } else if (err.error) {
              // Assuming the backend sends a simple error message string
              alert(`Signup failed: ${err.error}`);
            } else {
              alert('Signup failed: Bad request.');
            }
          } else {
            alert('An unexpected error occurred during signup.');
          }
        }
      });
  }
}
