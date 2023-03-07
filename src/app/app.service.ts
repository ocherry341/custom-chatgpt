import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage, ChatMessages } from './@shared/models/chat-messages.model';
import { ChatResponse } from './@shared/models/chat-response';

type StorageKey = 'API_KEY' | 'CHAT_SESSION' | 'CHAT_OPTIONS';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private http: HttpClient,
  ) { }

  private msg: ChatMessages = [
    { role: 'user', content: 'hello' },
    { role: 'assistant', content: 'I am bot' },
    { role: 'user', content: 'what is chatGPT' },
    { role: 'assistant', content: 'We’ve trained a model called ChatGPT which interacts in a conversational way. The dialogue format makes it possible for ChatGPT to answer followup questions, admit its mistakes, challenge incorrect premises, and reject inappropriate requests.' },
    { role: 'user', content: 'Methods' },
    { role: 'assistant', content: 'We trained this model using Reinforcement Learning from Human Feedback (RLHF), using the same methods as InstructGPT, but with slight differences in the data collection setup. We trained an initial model using supervised fine-tuning: human AI trainers provided conversations in which they played both sides—the user and an AI assistant. We gave the trainers access to model-written suggestions to help them compose their responses. We mixed this new dialogue dataset with the InstructGPT dataset, which we transformed into a dialogue format.' },
  ];

  private chatMessages$: BehaviorSubject<ChatMessages> = new BehaviorSubject<ChatMessages>(this.msg);
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

