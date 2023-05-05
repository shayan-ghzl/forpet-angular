import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'formGeneratorValidation',
  pure: false
})
export class FormGeneratorValidationPipe implements PipeTransform {

  transform(formControl: AbstractControl): string {
    if (formControl.validator && formControl.touched) {
      if (formControl.errors) {
        return 'is-invalid-dep';
      } else {
        return 'is-valid-dep';
      }
    }
    return 'waiting';
  }

}
