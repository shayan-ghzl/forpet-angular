import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
export interface FormGenerator {
  fieldAttribute: FormField;
  containerClass: string;
  fieldClass: string;
  label?: string;
  labelStar: boolean;
  icon?: string;
  button?:{
    label:string;
    class:string;
    submitForm:boolean;
    clickHandler:Function;
  },
  fieldErrorMessage?: string;
  errorAfterTouched?: boolean;
  validationUi: boolean;
  validation?: {
      isRequired?: boolean;
      isEmail?: boolean;
      minLength?: number;
      maxLength?: number;
      min?: number;
      max?: number;
      pattern?: RegExp;
  };
}
interface FormField {
  formControlName: string;
  value: string | boolean;
  isDisabled: boolean;
  type: 'text' | 'number' | 'password' | 'checkbox' | 'textarea' | 'select';
  placeholder?: string;
  hasTogglePassword?: boolean;
  selectOptions?: SelectOption[];
}
interface SelectOption {
  value: string;
  text: string;
}


@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss']
})
export class FormGeneratorComponent implements OnInit {

  @Output() submitHandler = new EventEmitter<FormGroup>();
  @Input() formGroupTemplate: FormGenerator[] = [];
  @Input() buttonLabel = '';
  @Input() buttonSpinnerSwitch = false;

  formGroup!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.formGroup = new FormGroup(this.buildForm(this.formGroupTemplate));
  }

  buildForm(formGenerator: FormGenerator[]) {
    let formGroupObject: any = {};
    formGenerator.forEach((Element) => {
      let temp = [];
      if (Element.validation) {
        for (const [key, value] of Object.entries(Element.validation)) {
          switch (key) {
            case 'isRequired':
              if (value) {
                temp.push(Validators.required);
              }
              break;
            case 'isEmail':
              if (value) {
                temp.push(Validators.email);
              }
              break;
            case 'minLength':
              temp.push(Validators.minLength(<number>value));
              break;
            case 'maxLength':
              temp.push(Validators.maxLength(<number>value));
              break;
            case 'min':
              temp.push(Validators.min(<number>value));
              break;
            case 'max':
              temp.push(Validators.max(<number>value));
              break;
            case 'pattern':
              temp.push(Validators.pattern(<RegExp>value));
              break;
            default:
              break;
          }
        }
      }
      formGroupObject[Element.fieldAttribute.formControlName] = new FormControl({ value: Element.fieldAttribute.value, disabled: Element.fieldAttribute.isDisabled }, temp);
    });
    return formGroupObject;
  }

}