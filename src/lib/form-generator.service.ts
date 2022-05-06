import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConditionService } from './condition/condition.service';

@Injectable({
  providedIn: 'root',
})
export class FormGeneratorService {

  constructor(private fB: FormBuilder, private iF: ConditionService) {
  }

  /**
   * FormGeneratorService creates reactive form groups, form controls and form arrays from Object
   * example:
   * ```
   *     Input = {
   *      "key": [
   *        "value",
   *        ['arrayValue'],
   *        {"fieldControl": "value", "fieldArray": ['arrayValue'], "fieldGroup": {"key": "anyValue"}}
   *      ],
   *      "fieldGroup": {"key": "primitiveOrArrayOrObject"}}
   *     }
   *     Output = FormGroup({
   *        "key": FormArray([
   *           FormControl('value'),
   *           FormArray([FormControl('arrayValue')]),
   *           FormGroup({
   *               FormGroup({fieldControl: FormControl('value')}),
   *               FormArray("fieldArray": [FormControl('arrayValue')]),
   *               FieldGroup...
   *             })
   *         ]),
   *         "fieldGroup": {"key": "primitiveOrArrayOrObject"}}
   *        }
   *     })
   *
   * @param {string} entitie some String or Array or Object;
   * @param {string} fieldName field name for root nesting level. Not necessary.
   * */
  public run(entitie: Record<string, unknown>, fieldName: string = ''): FormGroup | FormControl {
    return this.createGroupOrControl(entitie, fieldName);
  }

  private createArrayControl(fields: []): FormArray {
    const controls = this.fB.array([]);
    fields.forEach(field => controls.push(this.createGroupOrControl(field)));
    return controls;
  }

  private createGroupOrArrayOrControl(someObject: { [k: string]: any }): FormGroup | FormControl {
    const group = this.fB.group({});
    const control = this.fB.control({});

    if (this.iF.isObject(someObject)) {
      const someObjectKeys = Object.keys(someObject).length;
      if (someObjectKeys) {
        Object.keys(someObject).forEach((objectKey: string) => {
          Array.isArray(someObject[objectKey]) ?
            group.addControl(objectKey, this.createArrayControl(someObject[objectKey] as [])) :
            this.iF.isPrimitive(someObject[objectKey]) ?
              group.addControl(objectKey, this.fB.control(someObject[objectKey])) :
              this.createGroupOrArrayOrControl(someObject[objectKey] as { [k: string]: any });
        });
      }
      return group;
    } else {
      control.patchValue(someObject);
      return control;
    }
  }

  private createGroupOrControl(field: Record<string, unknown>, fieldName: string = ''): FormGroup | FormControl {
    return fieldName
      ? this.fB.group({ [fieldName]: this.createGroupOrArrayOrControl(field) })
      : this.createGroupOrArrayOrControl(field);
  }
}
