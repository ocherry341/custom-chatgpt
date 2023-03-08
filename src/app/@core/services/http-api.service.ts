import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throttleTime } from 'rxjs';
import { ChatMessage } from 'src/app/@shared/models/chat-messages.model';
import { ChatRequest } from 'src/app/@shared/models/chat-request.model';
import { ChatResponse } from 'src/app/@shared/models/chat-response.model';
import { environment } from 'src/environments/environment';
import { StoreService } from './store.service';

@Injectable()
export class HttpApiService {

  constructor(
    private http: HttpClient,
    private store: StoreService
  ) { }

  private createchat: string = `/v1/chat/completions`;

  chat(content: string) {
    const messages = this.store.getChatMessages().getValue();
    const option = this.store.getSettingValue();
    let chatMsg: ChatMessage[] = JSON.parse(JSON.stringify(messages));

    if (option.memory && option.memory !== -1) {
      const memoLength = 2 * option.memory;
      if (chatMsg.length > memoLength) {
        chatMsg = chatMsg.slice(chatMsg.length - memoLength);
      }
    }

    chatMsg.push({ role: 'user', content });
    if (option.system) {
      chatMsg.unshift({ role: 'system', content: option.system });
    }

    const url = `${option.apiurl || environment.defaultBaseUrl}${this.createchat}`;
    const body: ChatRequest = {
      messages: chatMsg,
      stream: false,
      ...option.apiOptions,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${option.apikey}`
    });
    console.log(body);
    return this.http.post<ChatResponse>(url, body, { headers }).pipe(throttleTime(500));
  }

  // chat(content: string) {
  //   return new Observable(sub => {
  //     const messages = this.store.getChatMessages().getValue();
  //     let chatMsg: ChatMessage[] = JSON.parse(JSON.stringify(messages));
  //     chatMsg.push({ role: 'user', content });
  //     chatMsg.push({ role: 'assistant', content: 'bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot bot ' });
  //     this.store.setChatMessages(chatMsg);

  //     sub.next();
  //     sub.complete();
  //   });
  // }
}
