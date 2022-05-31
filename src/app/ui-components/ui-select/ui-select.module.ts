import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiSelectComponent} from './ui-select.component';

@NgModule({
  declarations: [UiSelectComponent],
  imports: [
    CommonModule
  ],
  exports: [UiSelectComponent]
})
export class UiSelectModule {
}
