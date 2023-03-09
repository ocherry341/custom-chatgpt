import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from 'ng-devui';
import { Subject, throttleTime } from 'rxjs';
import { LocalStorageService, StoreService } from 'src/app/@core/services';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {

  @ViewChild('optionsList', { read: TemplateRef }) optionsList: TemplateRef<void>;
  @Input() chatTitle: string = 'Untitled Chat';
  @Input() chatIndex: number;
  @Output() optionsClick = new EventEmitter<void>();
  @Output() chatsClick = new EventEmitter<void>();
  @Output() chatFinish = new EventEmitter<void>();

  constructor(
    private store: StoreService,
    private storage: LocalStorageService,
    public chatService: ChatService,
    private toastService: ToastService
  ) { }

  chatInput: string;

  saveClick$ = new Subject<void>();

  private getCurrentOption() {
    const currentOption = this.storage.get('CURRENT_OPTION');
    if (currentOption) {
      this.store.setSettingOption(currentOption);
    }
  }

  ngOnInit() {
    this.getCurrentOption();
    this.saveClick$.pipe(throttleTime(1000))
      .subscribe(() => {
        this.saveChats();
      });
  }

  showOptions() {
    this.optionsClick.emit();
  }

  showChats() {
    this.chatsClick.emit();
  }

  enter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.chat();
    }
  }

  preventEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  textInput() {
    // this.chatInput.nativeElement.style.height = `${this.chatInput.nativeElement.scrollHeight}px`;
  }

  chat() {
    this.chatService.chat(this.chatInput).subscribe((res) => {
      if (res) {
        this.chatInput = '';
        this.chatFinish.emit();
      }
    });
  }

  clear() {
    this.store.setChatMessages([]);
    this.chatService.onError = false;
  }

  saveChats() {
    const message = this.store.getChatMessages().getValue();
    if (!message || message.length === 0) return;
    const option = this.store.getSettingOption().getValue();
    const thisChat = { title: this.chatTitle, message, option };

    const chatsSessions = this.storage.get('CHAT_SESSION');
    if (chatsSessions) {
      this.chatIndex != undefined
        ? chatsSessions[this.chatIndex] = thisChat
        : chatsSessions.push(thisChat);
      this.storage.set('CHAT_SESSION', chatsSessions);
    } else {
      this.storage.set('CHAT_SESSION', [thisChat]);
    }
    this.toastService.open({ value: [{ summary: '已保存', severity: 'success', life: 4500 }] });
  }

}
