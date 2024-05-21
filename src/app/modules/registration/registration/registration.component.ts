import { Component } from '@angular/core';
import { RegistrationService } from '../../../core/services/registration.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
  ) {
    this.registrationForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmedPassword: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const userData = {
        firstname: this.registrationForm.get('firstname')?.value,
        lastname: this.registrationForm.get('lastname')?.value,
        email: this.registrationForm.get('email')?.value,
        password: this.registrationForm.get('password')?.value,
      };

      this.registrationService.registerUser(userData).subscribe(
        (response) => this.handleSuccessResponse(response),
        (error: HttpErrorResponse) => this.handleError(error)
      );
    } else {
      this.errorMessage = 'Заполните все обязательные поля корректно.';
    }
  }

  isFieldInvalid(field: string): boolean {
    const formField = this.registrationForm.get(field);
    return formField !== null && formField !== undefined && formField.invalid && (formField.dirty || formField.touched);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  handleSuccessResponse(response: HttpResponse<any>): void {
    if (response.status === 201) {
      this.registrationForm.reset();
      this.successMessage = `Пользователь успешно зарегистрирован!`;
    }
  }

  handleError(error: HttpErrorResponse): void {
    if (error.status === 400) {
      this.errorMessage = error.error.message || 'Ошибка в запросе. Попробуйте снова.';
    } else {
      this.errorMessage = 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.';
    }
  }
}
