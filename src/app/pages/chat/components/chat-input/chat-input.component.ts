import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {

  @Output() submit: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('chatInput', { read: ElementRef }) chatInput: ElementRef<HTMLTextAreaElement>;
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

  textInput() {
    // this.chatInput.nativeElement.style.height = `${this.chatInput.nativeElement.scrollHeight}px`;
  }

  chat() {
    this.appService.chat('hello').subscribe();
    // this.appService.chat(this.chatinput).subscribe(() => {
    //   this.chatinput = '';
    // });
  }

  clear() {
    this.appService.setChatMessages([]);
  }

  ngOnInit() {
  }

}
