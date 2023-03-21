import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from 'src/app/@shared/models/chat-messages.model';
import { SettingOption, SettingValue } from 'src/app/@shared/models/setting.model';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class StoreService {

  constructor(
    private storage: LocalStorageService
  ) { }

  private readonly defaultOption: SettingOption = <const>{
    apikey: { use: true, value: '' },
    apiurl: { use: true, value: environment.defaultUrl },
    system: { use: true, value: 'You are a helpful assistant.' },
    memory: { use: false, value: -1 },
    apiOptions: {
      model: { use: true, value: 'gpt-3.5-turbo' },
      temperature: { use: true, value: 1 },
      top_p: { use: false, value: 1 },
      max_tokens: { use: false, value: 1 },
      n: { use: false, value: 1 },
      presence_penalty: { use: false, value: 0 },
      frequency_penalty: { use: false, value: 0 },
      logit_bias: { use: false, value: { 640: 20, 2435: 20 } },
      stop: { use: false, value: undefined },
    },
  };

  private defaultMessages: ChatMessage[] = [];

  private option$: BehaviorSubject<SettingOption> = new BehaviorSubject<SettingOption>(this.defaultOption);
  private chatMessages$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>(this.defaultMessages);

  getChatMessages() {
    return this.chatMessages$;
  }

  setChatMessages(chatMessages: ChatMessage[]) {
    this.chatMessages$.next(chatMessages);
  }

  pushChatMessages(chatMessage: ChatMessage) {
    const msgs = this.chatMessages$.getValue();
    msgs.push(chatMessage);
    this.chatMessages$.next(msgs);
  }


  getSettingOption(): BehaviorSubject<SettingOption> {
    return this.option$;
  }

  setSettingOption(value: SettingOption): void {
    this.option$.next(value);
    this.storage.set('CURRENT_OPTION', value);
  }

  getDefaultOption(apikey: string): SettingOption {
    const option: SettingOption = JSON.parse(JSON.stringify(this.defaultOption));
    option.apikey = { use: true, value: apikey };
    return option;
  }

  getSettingValue(): SettingValue {
    const result: SettingValue = {
      apikey: '',
      apiurl: '',
      apiOptions: {
        model: 'gpt-3.5-turbo'
      }
    };

    const set = this.option$.getValue();
    Object.entries(set).forEach(([key, { use, value }]) => {
      if (use && value != undefined) {
        result[key] = value;
      }
      if (key === 'apiOptions') {
        Object.entries(set.apiOptions).forEach(([key, { use, value }]) => {
          if (use && value != undefined) {
            result.apiOptions[key] = value;
          }
        });
      }
    });
    return result;
  }

}
