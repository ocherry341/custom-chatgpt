import { Injectable } from '@angular/core';
import { SavedChatMessage } from 'src/app/@shared/models/chat-messages.model';
import { SavedSettingOption, SettingOption } from 'src/app/@shared/models/setting.model';

type Storage = {
  'CHAT_SESSION': SavedChatMessage[];
  'CHAT_OPTIONS': SavedSettingOption[];
  'CURRENT_OPTION': SettingOption;
};

@Injectable()
export class LocalStorageService {

  get<K extends keyof Storage>(key: K): Storage[K] | null {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  }

  set<K extends keyof Storage>(key: K, value: Storage[K]) {
    localStorage.setItem(key, JSON.stringify(value));
  }

}
