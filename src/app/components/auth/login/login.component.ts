import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormArray } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  loginForm: FormGroup;
  eyeIcon = faEye;
  eyeSlashIcon = faEyeSlash;
  message = 'Vui lòng nhập thông tin đăng nhập';
  username = new FormControl('');
  password = new FormControl('');
  showPassword = false;
  @ViewChild('messageEl') messageElement!: ElementRef;
  onSubmit() {
    if (this.loginForm.invalid) {
      this.message = 'Vui lòng nhập đầy đủ thông tin';
      this.messageElement.nativeElement.classList.add('text-error');
      return;
    }
    this.message = '';
    this.messageElement.nativeElement.classList.remove('text-error');
    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => this.router.navigateByUrl(res.redirect || '/'),
      error: (err) => {
        this.message = 'Tên đăng nhập hoặc mật khẩu không đúng';
        this.messageElement.nativeElement.classList.add('text-error');
        console.error(err.message);
      },
    });
  }
}
