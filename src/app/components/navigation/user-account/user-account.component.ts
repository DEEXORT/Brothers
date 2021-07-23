import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UiModalService} from '../../../services/ui-modal.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {
  public formPassword: FormGroup;

  constructor(
    private fm: FormBuilder,
    private modal: UiModalService
  ) { }

  ngOnInit(): void {
    this.formPassword = this.fm.group({
      oldPassword: ['', new Validators()],
      newPassword: ['', new Validators()],
      newPassword2: ['', new Validators()],
    });
  }

  public logOff(): void {
    localStorage.clear();
    window.location.reload();
  }

  public onChangePassword(): void {
    console.log(this.formPassword.value);
  }

  public onModal(): void {
    this.modal.initModal({type: 'change_password'});
  }

}
