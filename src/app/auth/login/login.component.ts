import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

// Custom validator
function mustIncludeQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null; // valid
  }
  return { doesNotIncludeQuestionMark: true } // invalid
}

// Custom async validator
function emailIsUnique(control: AbstractControl) {
  // hardcoded voorbeeld van bestaand emailadres
  if (control.value.email === 'a@a.com') { 
    // "of" function van rxjs maakt een observable die meteen een waarde emit
    return of(null); 
  }
  return of({ notUnique: true }); // invalid
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
// Reactive form.
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Form setup:
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailIsUnique]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), mustIncludeQuestionMark]
    })
  });

  get emailIsInvalid() {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
  }
  get passwordIsInvalid() {
    return this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid
  }

  ngOnInit(): void {
    // Ophalen ingevoerde gegevens
    const savedForm = window.localStorage.getItem('saved-login-form');
    if (savedForm) {
      const loadedForm = JSON.parse(savedForm);
      this.form.patchValue({
        email: loadedForm.email
      })
    }

    // Opslaan ingevoerde gegevens
    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: value => {
        window.localStorage.setItem('saved-login-form', JSON.stringify({ email: value.email }))
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    console.log(this.form);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}
