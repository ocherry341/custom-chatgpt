import { Injectable } from '@angular/core';
import { DrawerService } from 'ng-devui';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../@core/services';
import { DrawerListComponent } from '../@shared/components/drawer-list/drawer-list.component';
import { SavedChatMessage } from '../@shared/models/chat-messages.model';
import { SavedSettingOption } from '../@shared/models/setting.model';

type DrawerItems = SavedSettingOption[] | SavedChatMessage[];

@Injectable({
  providedIn: 'root'
})
export class AppDrawerService {

  constructor(
    private storage: LocalStorageService,
    private drawerService: DrawerService,
  ) { }

  /**当前drawer的数据源 */
  // private currentStorage: 'CHAT_OPTIONS' | 'CHAT_SESSION';

  /**drawer选择事件 */
  private selectEvent = new Subject<{ index: number; item: SavedSettingOption | SavedChatMessage; }>();

  /**drawer删除事件 参数为chatIndex 清空=-1*/
  private deleteEvent = new Subject<number>();

  private showDrawer(items: DrawerItems | null, storageKey: 'CHAT_OPTIONS' | 'CHAT_SESSION') {
    const drawer = this.drawerService.open({
      drawerContentComponent: DrawerListComponent,
      width: '300px',
      zIndex: 1000,
      isCover: true,
      fullScreen: true,
      backdropCloseable: true,
      escKeyCloseable: true,
      position: 'left',
      data: {
        items,
        selectEvent: this.selectEvent,
        close: () => { drawer.drawerInstance.hide(); },
        storageKey,
        deleteEvent: this.deleteEvent,
      }
    });
  }

  getSelectEvent() {
    return this.selectEvent.asObservable();
  }

  getDeleteEvent() {
    return this.deleteEvent.asObservable();
  }

  open(key: 'CHAT_OPTIONS' | 'CHAT_SESSION') {
    const list = this.storage.get(key);
    // this.currentStorage = key;
    this.showDrawer(list, key);
  }

}
