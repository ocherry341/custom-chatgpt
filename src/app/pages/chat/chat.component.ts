import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DrawerService } from 'ng-devui';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
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
  chatMessages$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
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
  inChangeTitle: boolean = false;
  haveApiKey: boolean = false;
  generating: boolean = false;
  haveError: boolean = false;
  stream: boolean = true;

  //Other
  stop$ = new Subject<void>();
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
    this.chatMessages$ = this.store.getChatMessages();
    this.setCurrentOption();
    this.haveApiKey = !!this.store.getSettingOption().value.apikey.value;

    this.selectEvent.pipe(takeUntil(this.destroy$))
      .subscribe(({ index, item }) => {
        if ('message' in item) {
          this.chatTitle = item.title;
          this.chatIndex = index;
          this.savedIndex = this.chatMessages$.getValue().length - 1;
        }
      });

    this.deleteEvent.pipe(takeUntil(this.destroy$))
      .subscribe(index => {
        if (index === this.chatIndex || index === -1) {
          this.savedIndex = -1;
          this.chatIndex = -1;
        }
      });

    this.stop$.pipe(takeUntil(this.destroy$)).subscribe(() => { this.generating = false; });
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.destroy$.next();
    this.stop$.complete();
    this.destroy$.complete();
  }

  showList(key: 'CHAT_OPTIONS' | 'CHAT_SESSION') {
    const list = this.storage.get(key);
    this.currentStorage = key;
    this.showDrawer(list, key);
    this.stop$.next();
  }

  enter(e: KeyboardEvent) {
    e.key === 'Enter' ? this.startChat() : void 0;
  }

  preventEnter(e: KeyboardEvent) {
    e.key === 'Enter' ? e.preventDefault() : void 0;
  }

  setTextareaHeight() {
    this.textarea.nativeElement.style.height = `50px`;
    this.placeholder.nativeElement.style.height = '110px';
    const scrollHeight = this.textarea.nativeElement.scrollHeight;
    this.textarea.nativeElement.style.height = `${scrollHeight}px`;
    this.placeholder.nativeElement.style.height = `${scrollHeight + 60}px`;
  }

  startChat() {
    this.store.pushChatMessages({ role: 'user', content: this.chatInput });
    if (!this.generating && this.chatInput && !this.haveError) {
      this.generating = true;
      this.stream
        ? this.chatStream()
        : this.chat();
    }
  }

  chat() {
    this.http.chat()
      .pipe(takeUntil(this.stop$))
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res) this.chatInput = '';
          this.textarea.nativeElement.style.height = `50px`;
          this.placeholder.nativeElement.style.height = '110px';
          this.generating = false;
          const msg = res.choices[0].message ?? { role: 'assistant', content: 'err' };
          this.store.pushChatMessages(msg);
          //gen Title
          const title$ = this.http.genChatTitle(this.chatMessages$.value);
          if (title$) {
            title$.subscribe(val => { this.chatTitle = val; });
          }
        },
        error: (errMsg: string) => {
          this.generating = false;
          this.haveError = true;
          this.errMessage = errMsg;
        }
      });
  }

  chatStream() {

    this.http.chatStream();

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
    this.stop$.next();
  }

  changeTitle(input: HTMLInputElement) {
    this.inChangeTitle = true;
    setTimeout(() => {
      input.focus();
    });

  }

  changeTitleSubmit(value: string) {
    const title = value.trim();
    if (title) {
      this.chatTitle = title;
      if (this.chatIndex > -1) {
        this.saveChats(this.savedIndex);
      }
    }
    this.inChangeTitle = false;
  }

  setApiKey(key: string) {
    if (!key.trim()) return;
    const option = this.store.getSettingOption().value;
    option.apikey.value = key;
    this.store.setSettingOption(option);
    this.haveApiKey = true;
  }

}
