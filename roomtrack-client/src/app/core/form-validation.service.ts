import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FormValidationService {

  constructor() { }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  validateErrorField(form: FormGroup, fieldName: string, rule: string): boolean {
    const field = form.get(fieldName);
    return field?.errors?.[rule];
  }
}
