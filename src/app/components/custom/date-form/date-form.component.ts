import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import datepicker from 'js-datepicker';

@Component({
  selector: 'app-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.scss']
})
export class DateFormComponent implements OnInit, AfterViewInit {
  @Input() value: string = null;
  @Output() takeDate: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('DateForm') dateForm: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
    if (this.value) {
      this.takeDate.emit(Date.parse(this.value));
    }
  }

  ngAfterViewInit(): void {
    datepicker(this.dateForm.nativeElement, {
      onSelect: (instance, date) => {
        this.takeDate.emit(Date.parse(date));
      },
      formatter: (input, date, instance) => {
        const value = date.toLocaleDateString();
        input.value = value; // => '1/1/2099'
      }
    });
  }

}
