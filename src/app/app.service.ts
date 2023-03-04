import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage, ChatMessages } from './@shared/model/chat-messages.model';
import { ChatResponse } from './@shared/model/chat-response';

type StorageKey = 'API_KEY' | 'CHAT_SESSION' | 'CHAT_OPTIONS';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private http: HttpClient,
  ) { }

  private chatMessages$: BehaviorSubject<ChatMessages> = new BehaviorSubject<ChatMessages>([]);
  private baseUrl: string = environment.defaultBaseUrl;

  getChatMessages() {
    return this.chatMessages$;
  }

  setChatMessages(chatMessages: ChatMessages) {
    this.chatMessages$.next(chatMessages);
  }

  pushChatMessages(chatMessage: ChatMessage) {
    const msg = this.chatMessages$.value;
    msg.push(chatMessage);
    this.chatMessages$.next(msg);
  }

  chat(content: string) {
    return new Observable(subscriber => {
      const chatMsg = this.chatMessages$.value;
      chatMsg.push({ role: 'user', content });
      chatMsg.push({ role: 'assistant', content: "I'm bot." });
      this.chatMessages$.next(chatMsg);

      subscriber.next();
      subscriber.complete();
    });

    this.http.post<ChatResponse>(`${this.baseUrl}/v1/chat/completions`, {});

  }


  storage = {
    get(key: StorageKey): string | null {
      return localStorage.getItem(key);
    },
    set(key: StorageKey, value: string) {
      localStorage.setItem(key, value);
    }
  };
}

