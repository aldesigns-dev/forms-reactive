import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// function equalValues(control: AbstractControl) {
//   const password = control.get('password')?.value;
//   const confirmPassword = control.get('confirmPassword')?.value;
//   if (password === confirmPassword) {
//     return null;
//   }
//   return { passwordsNotEqual: true }
// }

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;
    if (val1 === val2) {
      return null;
    }
    return {
      valuesNotEqual: true
    }
  }
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required],
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    },
    {
      // validators: [equalValues],
      validators: [equalValues('password', 'confirmPassword')],
    }),
    firstName: new FormControl('', { 
      validators: [Validators.required]
    }),
    lastName: new FormControl('', { 
      validators: [Validators.required]
    }),
    street: new FormControl('', { 
      validators: [Validators.required]
    }),
    number: new FormControl('', { 
      validators: [Validators.required]
    }),
    postalCode: new FormControl('', { 
      validators: [Validators.required]
    }),
    city: new FormControl('', { 
      validators: [Validators.required]
    }),
    role: new FormControl<'student' | 'teacher' | 'Employee' | 'Founder' | 'Other'>('student', { 
      validators: [Validators.required]
    }),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    agree: new FormControl(false, {
      validators: [Validators.required]
    }),
  });
  
  onSubmit() {
    if (this.form.invalid) {
      console.log(this.form);
      return;
    }
  }

  onReset() {
    this.form.reset;
  }
}
