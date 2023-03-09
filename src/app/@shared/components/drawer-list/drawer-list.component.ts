import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() deleteClick = new EventEmitter<number>();
  @Output() selectClick = new EventEmitter<number>();
  @Output() clearClick = new EventEmitter<void>();

  constructor() {
  }

  deleteItem(e: MouseEvent, index: number) {
    e.stopPropagation();
    this.deleteClick.emit(index);
    if (this.items.length === 0) {
      this.close();
    }
  }

  selectItem(index: number) {
    this.selectClick.emit(index);
    this.close();
  }

  clear() {
    this.clearClick.emit();
    this.close();
  }

  ngOnInit() {
  }

}
