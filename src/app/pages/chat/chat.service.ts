import { Injectable } from '@angular/core';
import { Observable, Subject, of, tap } from 'rxjs';
import { StoreService } from 'src/app/@core/services';
import { HttpApiService } from 'src/app/@core/services/http-api.service';
import { ChatResponse } from 'src/app/@shared/models/chat-response.model';



@Injectable()
export class ChatService {

  constructor(
    private http: HttpApiService,
    private store: StoreService,
  ) { }

  generating: boolean = false;
  haveError: boolean = false;
  errMessage: string = '';

  private errMessage$: Subject<string> = new Subject<string>();

  private chatSave$ = new Subject<void>();
  private chatClear$ = new Subject<void>();

  sendChatSaveEvent() {
    this.chatSave$.next();
  }

  sendChatClearEvent() {
    this.chatClear$.next();
  }

  onChatSave() {
    return this.chatSave$.asObservable();
  }

  onChatClear() {
    return this.chatClear$.asObservable();
  }


  getErrMessage() {
    return this.errMessage$;
  }

  setErrMessage(value: string) {
    this.errMessage$.next(value);
  }

  chat(input: string | undefined): Observable<ChatResponse | null> {
    if (!this.generating && input && !this.haveError) {
      this.store.pushChatMessages({ role: 'user', content: input });
      this.generating = true;
      return this.http.chat(input).pipe(
        tap({
          next: (res) => {
            const msg = res.choices[0].message ?? { role: 'assistant', content: 'err' };
            this.store.pushChatMessages(msg);
            this.generating = false;
          },
          error: (errMsg: string) => {
            this.generating = false;
            this.haveError = true;
            this.errMessage = errMsg;
          },
        }),
      );
    } else {
      return of(null);
    }
  }

  genTitle(): Observable<string> | undefined {
    const messages = this.store.getChatMessages().getValue();
    if (messages.length !== 2) return;
    return this.http.genChatTitle(messages);
  }


}
