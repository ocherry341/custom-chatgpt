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

  getBody(option: SettingValue): ChatRequest {
    const messages = this.store.getChatMessages().getValue();
    let chatMsg: ChatMessage[] = JSON.parse(JSON.stringify(messages));

    if (option.memory && option.memory !== -1) {
      const memoLength = 2 * option.memory;
      if (chatMsg.length > memoLength) {
        chatMsg = chatMsg.slice(chatMsg.length - memoLength);
      }
    }

    if (option.system) {
      chatMsg.unshift({ role: 'system', content: option.system });
    }

    return {
      messages: chatMsg,
      stream: false,
      ...option.apiOptions,
    };
  }

  chat() {
    const option = this.store.getSettingValue();
    const url = `${option.apiurl || environment.defaultBaseUrl}${this.createchat}`;
    const body: ChatRequest = this.getBody(option);
    body.stream = false;
    const headers = this.getHeader(option.apikey);
    return this.http.post<ChatResponse>(url, body, { headers })
      .pipe(
        throttleTime(1000),
        catchError(err => {
          console.log(err);
          throw this.handleErr(err);
        })
      );
  }

  chatStream() {
    const option = this.store.getSettingValue();
    const url = `${option.apiurl || environment.defaultBaseUrl}${this.createchat}`;
    const body: ChatRequest = this.getBody(option);
    body.stream = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${option.apikey}`,
    });

    fetch(url, {
      method: 'POST', body: JSON.stringify(body), headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${option.apikey}`,
      }
    }).then(stream => {
      const reader = stream.body?.getReader();
      let text = '';
      reader?.read().then(({ done, value }) => {
        if (value) {
          for (var i = 0; i < value.byteLength; i++) {
            const char = String.fromCharCode(value[i]);
            text += char;
            // console.log(char);
          }
        }
      });
      console.log('text', text);
    });


  }


  genChatTitle(messages: ChatMessage[]): Observable<string> | undefined {
    if (messages.length !== 2) return;
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
      const err0 = err.error;
      let openAIMsg: string;
      if (typeof err0 === 'string') {
        try {
          openAIMsg = JSON.parse(err0).error.message;
        } catch (error) {
          openAIMsg = err0;
        }
      } else {
        openAIMsg = err.error?.error?.message;
      }
      const msg = openAIMsg || err.message;
      return msg;
    } else {
      return '未知错误';
    }
  }

}
