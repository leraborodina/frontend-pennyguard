import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/guards/auth.service';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm?.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isRequired(field: string): boolean {
    const control = this.loginForm?.get(field);
    return !!control && !!control.errors?.['required'];
  }

  isEmailInvalid(): boolean {
    const control = this.loginForm?.get('email');
    return !!control && !!control.errors?.['email'] && control.touched;
  }

  isMinLengthInvalid(field: string): boolean {
    const control = this.loginForm?.get(field);
    return !!control && !!control.errors?.['minlength'] && control.touched;
  }

  onSubmit(): void {
    if (!this.loginForm) {
      return;
    }

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .subscribe(
        (response) => this.handleSuccessfulLogin(response.token),
        (error: HttpErrorResponse) => this.handleLoginError(error)
      );
  }

  private handleSuccessfulLogin(token: string): void {
    this.errorMessage = null;
    this.authService.setAuthToken(token);

    const userData = this.userService.getUserData();
    const userName = userData?.firstname + ' ' + userData?.lastname;

    this.userService.setUsername(userName);

    const redirectUrl = this.authService.getRedirectUrl();
    this.router.navigate([redirectUrl]);
  }


  private handleLoginError(error: HttpErrorResponse): void {
    this.errorMessage = error.error || 'Ошибка входа. Попробуйте еще раз.';
    console.error('Login error:', this.errorMessage);
  }
}
