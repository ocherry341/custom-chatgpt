import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogService } from 'ng-devui';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { StoreService } from 'src/app/@core/services';
import { ChatMessage } from 'src/app/@shared/models/chat-messages.model';
import { ChatService } from '../../chat.service';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {

  @ViewChild('apikeyInput', { read: TemplateRef }) apikeyInput: TemplateRef<any>;
  @Input() chatTitle: string;
  @Input()
  set chatIndex(value: number) {
    if (value > -1) {
      this.savedIndex = this.chatMessages$.getValue().length - 1;
    } else {
      this.savedIndex = -1;
    }
  }


  constructor(
    private dialogService: DialogService,
    private store: StoreService,
    public chatService: ChatService
  ) { }


  apikey: string | null;
  chatMessages$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  savedIndex: number;
  destory$ = new Subject<void>();

  ngOnInit() {
    this.chatMessages$ = this.store.getChatMessages();
    this.chatService.onChatClear().pipe(takeUntil(this.destory$))
      .subscribe(() => {
        this.savedIndex = -1;
      });

    this.chatService.onChatSave().pipe(takeUntil(this.destory$))
      .subscribe(() => {
        this.savedIndex = this.chatMessages$.getValue().length - 1;
      });
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

}
