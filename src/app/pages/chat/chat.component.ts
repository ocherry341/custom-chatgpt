import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DrawerService } from 'ng-devui';
import { Subject, takeUntil } from 'rxjs';
import { LocalStorageService, StoreService } from 'src/app/@core/services';
import { HttpApiService } from 'src/app/@core/services/http-api.service';
import { DrawerListComponent } from 'src/app/@shared/components/drawer-list/drawer-list.component';
import { ChatMessage, SavedChatMessage } from 'src/app/@shared/models/chat-messages.model';
import { SavedSettingOption } from 'src/app/@shared/models/setting.model';

type DrawerItems = SavedSettingOption[] | SavedChatMessage[];

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('drawer', { read: TemplateRef }) drawerTpl: TemplateRef<void>;
  @ViewChild('textarea', { read: ElementRef }) textarea: ElementRef<HTMLTextAreaElement>;
  @ViewChild('placeholder', { read: ElementRef }) placeholder: ElementRef<HTMLDivElement>;

  constructor(
    private storage: LocalStorageService,
    private store: StoreService,
    private drawerService: DrawerService,
    private http: HttpApiService,
  ) { }

  //Chat
  messages: ChatMessage[] = [];
  chatTitle: string = '新对话';
  errMessage: string = '';
  chatInput: string;

  //Save and Read
  /**drawer选择事件 */
  selectEvent = new Subject<{ index: number; item: SavedSettingOption | SavedChatMessage; }>();
  /**drawer删除事件 参数为chatIndex 清空=-1*/
  deleteEvent = new Subject<number>();
  /**当前drawer的数据源 */
  currentStorage: 'CHAT_OPTIONS' | 'CHAT_SESSION';
  /**读取chat的index */
  chatIndex: number;
  /**保存图标出现的位置 */
  savedIndex: number;
  /**鼠标悬停的位置 */
  hoverIndex: number;

  //State
  haveApiKey: boolean = false;
  haveError: boolean = false;
  stream: boolean = true;

  genStart: boolean = false;
  genPendding: boolean = false;

  //Other
  destroy$ = new Subject<void>();

  private showDrawer(items: DrawerItems | null, storageKey: 'CHAT_OPTIONS' | 'CHAT_SESSION') {
    const drawer = this.drawerService.open({
      drawerContentComponent: DrawerListComponent,
      width: '300px',
      zIndex: 1000,
      isCover: true,
      fullScreen: true,
      backdropCloseable: true,
      escKeyCloseable: true,
      position: storageKey === 'CHAT_SESSION' ? 'left' : 'right',
      data: {
        items,
        selectEvent: this.selectEvent,
        close: () => { drawer.drawerInstance.hide(); },
        storageKey,
        deleteEvent: this.deleteEvent,
      }
    });
  }

  private setCurrentOption() {
    const currentOption = this.storage.get('CURRENT_OPTION');
    if (currentOption) {
      this.store.setSettingOption(currentOption);
    }
  }

  ngOnInit() {
    this.store.getChatMessages().pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        this.messages = msg;
      });

    this.setCurrentOption();
    this.haveApiKey = !!this.store.getSettingOption().value.apikey.value;

    this.selectEvent.pipe(takeUntil(this.destroy$))
      .subscribe(({ index, item }) => {
        //select saved message
        if ('message' in item) {
          this.stop();
          this.chatTitle = item.title;
          this.chatIndex = index;
          this.savedIndex = this.messages.length - 1;
          this.haveError = false;
        }
      });

    this.deleteEvent.pipe(takeUntil(this.destroy$))
      .subscribe(index => {
        if (index === this.chatIndex || index === -1) {
          this.savedIndex = -1;
          this.chatIndex = -1;
        }
      });
  }

  ngOnDestroy(): void {
    this.stop();
    this.destroy$.next();
    this.destroy$.complete();
  }

  stop() {
    this.http.stop();
  }

  showList(key: 'CHAT_OPTIONS' | 'CHAT_SESSION') {
    const list = this.storage.get(key);
    this.currentStorage = key;
    this.showDrawer(list, key);
    this.stop();
  }

  enter(e: KeyboardEvent) {
    e.key === 'Enter' ? this.startChat() : void 0;
  }

  preventEnter(e: KeyboardEvent) {
    e.key === 'Enter' ? e.preventDefault() : void 0;
  }

  setTextareaHeight() {
    this.textarea.nativeElement.style.height = `50px`;
    this.placeholder.nativeElement.style.height = '160px';
    const scrollHeight = this.textarea.nativeElement.scrollHeight;
    this.textarea.nativeElement.style.height = `${scrollHeight}px`;
    this.placeholder.nativeElement.style.height = `${scrollHeight + 115}px`;
  }

  startChat() {
    const canChat = !this.genPendding && this.chatInput && !this.haveError;
    if (!canChat) return;
    this.store.pushChatMessages({ role: 'user', content: this.chatInput });
    this.clearInput();
    this.genStart = true;
    this.genPendding = true;
    this.stream
      ? this.chatStream()
      : this.chat();
  }

  clearInput() {
    this.chatInput = '';
    this.textarea.nativeElement.style.height = `50px`;
    this.placeholder.nativeElement.style.height = '160px';
  }

  chat() {
    this.http.chat()
      .subscribe({
        next: (res) => {
          this.genStart = false;
          this.genPendding = false;
          const msg = res.choices[0].message ?? { role: 'assistant', content: 'err' };
          this.store.pushChatMessages(msg);
          //gen Title
          const title$ = this.http.genChatTitle(this.messages);
          if (title$) {
            title$.subscribe(val => { this.chatTitle = val; });
          }
        },
        error: (errMsg: string) => {
          this.genStart = false;
          this.genPendding = false;
          this.haveError = true;
          this.errMessage = errMsg;
        }
      });
  }

  chatStream() {
    this.http.chatStream()
      .subscribe({
        next: (text) => {
          const message = this.messages;
          const lastMsg = message[message.length - 1];
          if (lastMsg.role === 'user') {
            this.genStart = false;
            message.push({ role: 'assistant', content: text });
          } else {
            lastMsg.content += text;
          }
        },
        complete: () => {
          const message = this.messages;
          this.store.setChatMessages(message);
          this.genPendding = false;
          //gen Title
          const title$ = this.http.genChatTitle(message);
          if (title$) {
            title$.subscribe(val => { this.chatTitle = val; });
          }
        },
        error: (errMsg) => {
          this.genStart = false;
          this.genPendding = false;
          this.haveError = true;
          this.errMessage = errMsg;
        }
      });

  }

  reGenerate() {
    if (this.messages[this.messages.length - 1].role === 'assistant') {
      this.messages.pop();
    }
    this.genStart = true;
    this.genPendding = true;
    this.stream
      ? this.chatStream()
      : this.chat();
  }

  chatListHover(index: number) {
    this.hoverIndex = index;
  }

  mouseout() {
    this.hoverIndex = -1;
  }

  /**
   * 保存当前对话
   * @param index saveIndex
   */
  saveChats(index: number) {
    const message = this.store.getChatMessages().getValue();
    if (!message || message.length === 0) return;
    const savingMsg = message.slice(0, index + 1);
    const option = this.store.getSettingOption().getValue();
    const thisChat = { title: this.chatTitle, message: savingMsg, option };
    this.savedIndex = index;

    const chatsSessions = this.storage.get('CHAT_SESSION');
    if (chatsSessions) {
      if (this.chatIndex > -1) {
        chatsSessions[this.chatIndex] = thisChat;
      } else {
        chatsSessions.push(thisChat);
        this.chatIndex = chatsSessions.length - 1;
      }
      this.storage.set('CHAT_SESSION', chatsSessions);
    } else {
      this.storage.set('CHAT_SESSION', [thisChat]);
    }
  }

  clear() {
    this.store.setChatMessages([]);
    this.haveError = false;
    this.chatIndex = -1;
    this.savedIndex = -1;
    this.chatTitle = '新对话';
    this.stop();
  }

  changeTitle(input: HTMLInputElement, title: HTMLDivElement) {
    input.classList.remove('hide');
    title.classList.add('hide');
    setTimeout(() => {
      input.focus();
    });
  }

  changeTitleSubmit(input: HTMLInputElement, title: HTMLDivElement) {
    const value = input.value.trim();
    if (value) {
      this.chatTitle = value;
      if (this.chatIndex > -1) {
        this.saveChats(this.savedIndex);
      }
    }
    input.classList.add('hide');
    title.classList.remove('hide');
  }

  setApiKey(key: string) {
    if (!key.trim()) return;
    const option = this.store.getSettingOption().value;
    option.apikey.value = key;
    this.store.setSettingOption(option);
    this.haveApiKey = true;
  }

}
