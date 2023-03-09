import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DrawerService, ToastService } from 'ng-devui';
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
    private toastService: ToastService,
    private drawerService: DrawerService,
    private http: HttpApiService,
  ) { }

  //Chat
  chatMessages$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  chatTitle: string = '新对话';
  generating: boolean = false;
  haveError: boolean = false;
  errMessage: string = '';
  chatInput: string;

  savedIndex: number;
  hoverIndex: number;

  //Save and Read
  selectEvent = new Subject<{ index: number; item: SavedSettingOption | SavedChatMessage; }>();
  currentStorage: 'CHAT_OPTIONS' | 'CHAT_SESSION';
  chatIndex: number;

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

    this.selectEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ index, item }) => {
        if ('message' in item) {
          this.chatTitle = item.title;
          this.chatIndex = index;
          this.savedIndex = this.chatMessages$.getValue().length - 1;
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
  }

  enter(e: KeyboardEvent) {
    e.key === 'Enter' ? this.chat() : void 0;
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

  chat() {
    this.store.pushChatMessages({ role: 'user', content: this.chatInput });
    if (!this.generating && this.chatInput && !this.haveError) {
      this.generating = true;
      this.http.chat(this.chatInput)
        .pipe(takeUntil(this.stop$))
        .subscribe({
          next: (res) => {
            // console.log(res);
            if (res) this.chatInput = '';
            this.setTextareaHeight();
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
  }


  chatListHover(index: number) {
    this.hoverIndex = index;
  }

  mouseout() {
    this.hoverIndex = -1;
  }

  saveChats(index: number) {
    const message = this.store.getChatMessages().getValue();
    if (!message || message.length === 0) return;
    const savingMsg = message.slice(0, index + 1);
    const option = this.store.getSettingOption().getValue();
    const thisChat = { title: this.chatTitle, message: savingMsg, option };
    this.savedIndex = index;

    const chatsSessions = this.storage.get('CHAT_SESSION');
    if (chatsSessions) {
      this.chatIndex > -1
        ? chatsSessions[this.chatIndex] = thisChat
        : chatsSessions.push(thisChat);
      this.storage.set('CHAT_SESSION', chatsSessions);
    } else {
      this.storage.set('CHAT_SESSION', [thisChat]);
    }
    this.toastService.open({ value: [{ summary: '已保存', severity: 'success', life: 4500 }] });
  }

  clear() {
    this.store.setChatMessages([]);
    this.haveError = false;
    this.chatIndex = -1;
    this.savedIndex = -1;
    this.chatTitle = '新对话';
    this.stop$.next();
  }

}
