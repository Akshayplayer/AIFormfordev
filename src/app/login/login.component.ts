import { Component, NgModule } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  myForm:FormGroup= new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  @Output() close = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.myForm.value)
      .subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token);
          this.close.emit();
          this.router.navigate(['/dashboard']); // redirect to secure page
        },
        error: (err) => console.error(err)
      });
  }
}
