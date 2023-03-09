import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throttleTime } from 'rxjs';
import { ChatMessage } from 'src/app/@shared/models/chat-messages.model';
import { ChatRequest } from 'src/app/@shared/models/chat-request.model';
import { ChatResponse } from 'src/app/@shared/models/chat-response.model';
import { SettingValue } from 'src/app/@shared/models/setting.model';
import { environment } from 'src/environments/environment';
import { StoreService } from './store.service';

@Injectable()
export class HttpApiService {

  constructor(
    private http: HttpClient,
    private store: StoreService
  ) { }

  private createchat: string = `/v1/chat/completions`;

  private getHeader(apikey: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apikey}`
    });
  }

  getBody(option: SettingValue, chatInput: string): ChatRequest {
    const messages = this.store.getChatMessages().getValue();
    let chatMsg: ChatMessage[] = JSON.parse(JSON.stringify(messages));

    if (option.memory && option.memory !== -1) {
      const memoLength = 2 * option.memory;
      if (chatMsg.length > memoLength) {
        chatMsg = chatMsg.slice(chatMsg.length - memoLength);
      }
    }

    chatMsg.push({ role: 'user', content: chatInput });
    if (option.system) {
      chatMsg.unshift({ role: 'system', content: option.system });
    }


    return {
      messages: chatMsg,
      stream: false,
      ...option.apiOptions,
    };
  }

  chat(chatInput: string) {
    const option = this.store.getSettingValue();
    const url = `${option.apiurl || environment.defaultBaseUrl}${this.createchat}`;
    const body: ChatRequest = this.getBody(option, chatInput);
    const headers = this.getHeader(option.apikey);
    return this.http.post<ChatResponse>(url, body, { headers })
      .pipe(
        throttleTime(500),
        catchError(err => {
          throw this.handleErr(err);
        })
      );
  }

  genChatTitle(messages: ChatMessage[]): Observable<string> {
    const defaultTitle = '新对话';
    const option = this.store.getSettingValue();
    const url = `${option.apiurl || environment.defaultBaseUrl}${this.createchat}`;
    const headers = this.getHeader(option.apikey);
    const queryMsg = messages.slice(0, 2);
    queryMsg.push({ role: 'user', content: '为以上对话取一个标题，10个字以内' });
    const body: ChatRequest = { model: 'gpt-3.5-turbo', messages: queryMsg };
    return this.http.post<ChatResponse>(url, body, { headers })
      .pipe(
        map(res => {
          return res.choices[0].message?.content ?? defaultTitle;
        }),
        throttleTime(1000),
        retry(2),
        catchError(err => {
          return defaultTitle;
        }),
      );
  }

  handleErr(err): string {
    if (err instanceof HttpErrorResponse) {
      const msg = err.error?.error?.message ?? err.message;
      return msg;
    } else {
      return '未知错误';
    }
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
