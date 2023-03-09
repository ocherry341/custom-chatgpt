import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DrawerService, ToastService } from 'ng-devui';
import { LocalStorageService, StoreService } from 'src/app/@core/services';
import { SavedChatMessage } from 'src/app/@shared/models/chat-messages.model';
import { SavedSettingOption } from 'src/app/@shared/models/setting.model';
import { ChatService } from './chat.service';

type DrawerItems = SavedSettingOption[] | SavedChatMessage[];

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  @ViewChild('drawer', { read: TemplateRef }) drawerTpl: TemplateRef<void>;

  constructor(
    private storage: LocalStorageService,
    private store: StoreService,
    private toastService: ToastService,
    private drawerService: DrawerService,
    private chatService: ChatService
  ) { }

  drawerItems: DrawerItems = [];
  close: () => void;
  currentStorage: 'CHAT_OPTIONS' | 'CHAT_SESSION';
  chatTitle: string = 'UnTitled Chat';
  chatIndex: number;

  private showDrawer(items: DrawerItems | null) {
    this.drawerItems = items ? items : [];
    const drawer = this.drawerService.open({
      contentTemplate: this.drawerTpl,
      width: '300px',
      zIndex: 1000,
      isCover: true,
      fullScreen: true,
      backdropCloseable: true,
      escKeyCloseable: true,
      position: 'left'
    });
    this.close = () => { drawer.drawerInstance.hide(); };
  }

  chatsClick() {
    const chatsSessions = this.storage.get('CHAT_SESSION');
    this.currentStorage = 'CHAT_SESSION';
    this.showDrawer(chatsSessions);
  }

  optionsClick() {
    const options = this.storage.get('CHAT_OPTIONS');
    this.currentStorage = 'CHAT_OPTIONS';
    this.showDrawer(options);
  }

  clearItems() {
    this.drawerItems = [];
    localStorage.removeItem(this.currentStorage);
  }

  deleteItem(index: number) {
    this.drawerItems.splice(index, 1);
    this.storage.set(this.currentStorage, this.drawerItems);
  }

  selectItems(index: number) {
    const item = this.drawerItems[index];
    this.store.setSettingOption(item.option);
    if (this.currentStorage === 'CHAT_SESSION' && 'message' in item) {
      this.store.setChatMessages(item.message);
      this.chatTitle = item.title;
      this.chatIndex = index;
    }

    const toastTile = this.currentStorage === 'CHAT_OPTIONS'
      ? '载入配置'
      : '载入对话';
    this.toastService.open({
      value: [{
        summary: `${toastTile} ${item.title}`,
        severity: 'success',
        life: 4500,
      }]
    });
  }

  chatFinish() {
    const title$ = this.chatService.genTitle();
    if (title$) {
      title$.subscribe(val => {
        this.chatTitle = val;
      });
    }

  }



  ngOnInit() { }

}
