import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogService } from 'ng-devui';
import { BehaviorSubject } from 'rxjs';
import { StoreService } from 'src/app/@core/services';
import { ChatMessage } from 'src/app/@shared/models/chat-messages.model';
import { ChatService } from '../../chat.service';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  @ViewChild('apikeyInput', { read: TemplateRef }) apikeyInput: TemplateRef<any>;

  constructor(
    private dialogService: DialogService,
    private store: StoreService,
    public chat: ChatService
  ) { }

  apikey: string | null;
  hasApikey: boolean = false;
  chatMessages$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

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
              // this.storage.set('API_KEY', this.apikey);
              this.hasApikey = true;
            };
            dialog.modalInstance.hide();
          },
        }
      ]
    });
  }

  ngOnInit() {
    this.hasApikey = true;
    this.chatMessages$ = this.store.getChatMessages();
  }

}
