import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiModalService} from '../../../services/ui-modal.service';
import {SubscriptionLike} from 'rxjs';

@Component({
  selector: 'app-ui-modal',
  templateUrl: './ui-modal.component.html',
  styleUrls: ['./ui-modal.component.scss']
})
export class UiModalComponent implements OnInit, OnDestroy {
  private modalSubs$: SubscriptionLike;
  public showModalWindow = false;
  constructor(private modal: UiModalService) { }

  ngOnInit(): void {
   this.modalSubs$ =  this.modal.getModalSubscribe()
      .subscribe((config: any) => {
        if (config && config.type === 'change_password') {
          this.showModalWindow = !this.showModalWindow;
          // this.showModalWindow = true;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.modalSubs$) {
      this.modalSubs$.unsubscribe();
    }
  }

}
