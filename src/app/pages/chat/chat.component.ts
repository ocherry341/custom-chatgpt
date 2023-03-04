import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessages } from 'src/app/@shared/model/chat-messages.model';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(
    private appService: AppService
  ) { }

  chatMessages$: BehaviorSubject<ChatMessages> = new BehaviorSubject<ChatMessages>([]);

  ngOnInit() {
    this.chatMessages$ = this.appService.getChatMessages();
  }

}
