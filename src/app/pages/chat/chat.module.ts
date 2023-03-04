import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ChatComponent } from './chat.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ChatComponent,
    ChatListComponent,
    ChatInputComponent,
  ],
  exports: [ChatComponent]
})
export class ChatModule { }
