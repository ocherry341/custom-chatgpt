import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, retry, takeUntil, throttleTime } from 'rxjs';
import { ChatMessage } from 'src/app/@shared/models/chat-messages.model';
import { ChatRequest } from 'src/app/@shared/models/chat-request.model';
import { ChatResponse, ChatStreamData } from 'src/app/@shared/models/chat-response.model';
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

  private stop$ = new Subject<void>();
  private controller: AbortController;

  private getHeader(apikey: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apikey}`
    });
  }

  stop() {
    if (this.controller) this.controller.abort();
    this.stop$.next();
  }

  getBody(option: SettingValue, stream: boolean): ChatRequest {
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
      stream: stream,
      ...option.apiOptions,
    };
  }

  chat() {
    const option = this.store.getSettingValue();
    const url = `${option.apiurl || environment.defaultBaseUrl}${this.createchat}`;
    const body: ChatRequest = this.getBody(option, false);
    const headers = this.getHeader(option.apikey);
    return this.http.post<ChatResponse>(url, body, { headers })
      .pipe(
        throttleTime(1000),
        catchError(err => {
          throw this.handleErr(err);
        }),
        takeUntil(this.stop$),
      );
  }

  chatStream() {
    return new Observable<string>(observer => {
      const option = this.store.getSettingValue();
      const url = `${option.apiurl || environment.defaultBaseUrl}${this.createchat}`;
      const body: ChatRequest = this.getBody(option, true);
      this.controller = new AbortController();
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${option.apikey}`,
        },
        signal: this.controller.signal
      }).then(response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!response.ok) {
          reader?.read().then(({ done, value }) => {
            try {
              const err = JSON.parse(decoder.decode(value));
              observer.error(err.error.message);
            } catch (error) {
              observer.error('未知错误');
            }
          });
        }

        function push() {
          return reader?.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              return;
            }
            const string = decoder.decode(value);
            const eventStr = string.split('\n\n');
            let content = '';
            for (let i = 0; i < eventStr.length; i++) {
              const str = eventStr[i];
              if (str === 'data: [DONE]') break;
              if (str && str.slice(0, 6) === 'data: ') {
                const jsonStr = str.slice(6);
                const data: ChatStreamData = JSON.parse(jsonStr);
                const thisContent = data.choices[0].delta?.content || '';
                content += thisContent;
              }
            }
            observer.next(content);
            push();
          });
        }
        push();
      }).catch((err: Error) => {
        observer.error(err?.message ?? '未知错误');
      });
    }).pipe(takeUntil(this.stop$));
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
