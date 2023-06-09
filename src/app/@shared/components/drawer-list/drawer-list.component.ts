import { Component, Input, OnInit } from '@angular/core';
import { ToastService } from 'ng-devui';
import { Subject } from 'rxjs';
import { LocalStorageService, StoreService } from 'src/app/@core/services';
import { SavedChatMessage } from '../../models/chat-messages.model';
import { SavedSettingOption } from '../../models/setting.model';

@Component({
  selector: 'app-drawer-list',
  templateUrl: './drawer-list.component.html',
  styleUrls: ['./drawer-list.component.scss']
})
export class DrawerListComponent implements OnInit {

  @Input() items: SavedSettingOption[] | SavedChatMessage[] = [];
  @Input() close: () => void;
  @Input() selectEvent: Subject<{ index: number; item: SavedSettingOption | SavedChatMessage; }>;
  @Input() deleteEvent: Subject<number>;
  @Input() storageKey: 'CHAT_OPTIONS' | 'CHAT_SESSION';


  constructor(
    private storage: LocalStorageService,
    protected store: StoreService,
    private toastService: ToastService,
  ) { }

  header: string = '';
  apikey: string | undefined = '';
  apiurl: string | undefined = '';

  ngOnInit() {
    this.header = this.storageKey === 'CHAT_OPTIONS'
      ? $localize`:Saved Options title:保存的设置`
      : $localize`:Saved Chat Session title:保存的对话`;

    const currentOption = this.storage.get('CURRENT_OPTION');
    this.apikey = currentOption?.apikey.value;
    this.apiurl = currentOption?.apiurl.value;
  }

  deleteItem(e: MouseEvent, index: number) {
    e.stopPropagation();
    this.items.splice(index, 1);
    this.storage.set(this.storageKey, this.items);
    if (this.items.length === 0) {
      this.close();
    }
    this.deleteEvent.next(index);
  }

  selectItem(index: number) {
    const item = this.items[index];
    if (this.apikey) {
      item.option.apikey.value = this.apikey;
    }
    if (this.apiurl) {
      item.option.apiurl.value = this.apiurl;
    }
    this.store.setSettingOption(item.option);
    if ('message' in item) {
      this.store.setChatMessages(item.message);
    } else {
      this.toastService.open({
        value: [{ summary: $localize`载入配置 ${item.title}`, severity: 'success', life: 4500, }]
      });
    }
    this.selectEvent.next({ index, item });
    this.close();
  }

  clear() {
    this.items = [];
    localStorage.removeItem(this.storageKey);
    this.close();
    this.deleteEvent.next(-1);
  }



}
