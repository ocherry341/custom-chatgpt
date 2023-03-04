import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {

  @Output() submit: EventEmitter<string> = new EventEmitter<string>();
  @HostListener('window:keyup', ['$event'])
  enter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.chat();
    }
  }

  constructor(
    private appService: AppService
  ) { }

  chatinput: string;

  chat() {
    this.appService.chat(this.chatinput).subscribe(() => {
      this.chatinput = '';
    });
  }

  ngOnInit() {
  }

}
