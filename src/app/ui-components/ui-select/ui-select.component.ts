import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-ui-select',
  templateUrl: './ui-select.component.html',
  styleUrls: ['./ui-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
})
export class UiSelectComponent implements ControlValueAccessor {
  value: number = null;

  onChange: (value: number) => void = null;
  onTouched: (value: number) => void = null;

  @Input() label = '';
  @Input() list: { id: number, name: string }[] = [];
  @Input() selectName: '';
  @Input() defaultOption: '';

  constructor() {
  }

  onSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.value = +select.value;
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: number): void {
    this.value = value;
  }

}
