import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogService } from 'ng-devui';
import { ChatMessages } from 'src/app/@shared/model/chat-messages.model';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  @Input() chatMessages: ChatMessages | null;
  @ViewChild('apikeyInput', { read: TemplateRef }) apikeyInput: TemplateRef<any>;

  constructor(
    private dialogService: DialogService,
    private appService: AppService
  ) { }

  apikey: string | null;
  hasApikey: boolean = false;

  login() {
    const dialog = this.dialogService.open({
      id: 'login',
      title: 'Login',
      contentTemplate: this.apikeyInput,
      buttons: [
        {
          cssClass: 'primary',
          text: '确定',
          handler: () => {
            if (this.apikey) {
              this.appService.storage.set('API_KEY', this.apikey);
              this.hasApikey = true;
            };
            dialog.modalInstance.hide();
          },
        }
      ]
    });
  }

  ngOnInit() {
    this.hasApikey = !!this.appService.storage.get('API_KEY');
  }

}
