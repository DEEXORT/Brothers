import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-protocol-form-players',
  templateUrl: './protocol-form-players.component.html',
  styleUrls: ['./protocol-form-players.component.scss']
})
export class ProtocolFormPlayersComponent implements OnInit {
  @Input() value: any = null;
  @Input() playerName: string = null;
  @Input() playerId: number = null;
  @Output() takeForm: EventEmitter<any> = new EventEmitter<any>();
  public formStatsValues: FormGroup;


  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formStatsValues = this.fb.group({
      id: ['', new Validators()],
      player_id: ['', new Validators()],
      game_id: ['', new Validators()],
      protocol_id: ['', new Validators()],
      pa: ['', new Validators()],
      run: ['', new Validators()],
      rbi: ['', new Validators()],
      bb: ['', new Validators()],
      hbp: ['', new Validators()],
      one_b: ['', new Validators()],
      two_b: ['', new Validators()],
      three_b: ['', new Validators()],
      so: ['', new Validators()],
      go: ['', new Validators()],
      fo: ['', new Validators()],
      ro: ['', new Validators()],
      hr: ['', new Validators()],
    });
    if (this.value){
      this.formStatsValues.setValue(this.value);
    }
  }

  public onFormChange(event: any): void {
    for (let i of Object.keys(this.formStatsValues.value)){
      if (this.value.player_id === this.formStatsValues.value.player_id){
        i = event.target.value;
        this.takeForm.emit(this.formStatsValues.value);
      }
    }

  }

}


