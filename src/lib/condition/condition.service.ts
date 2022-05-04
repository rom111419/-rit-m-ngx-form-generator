import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConditionService {

  constructor() {
  }

  public isObject(field: any): boolean {
    return !this.isPrimitive(field) && !!field && !Array.isArray(field);
  }

  public isPrimitive(field: any): boolean {
    return (typeof field === 'string' || typeof field === 'number' || typeof field === 'boolean' || field === null);
  }
}
