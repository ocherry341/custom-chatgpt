import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MarkdownModule.forChild()
  ],
  declarations: [
    ChatComponent,
    ChatListComponent,
    ChatInputComponent,
  ],
  exports: [ChatComponent],
  providers: [ChatService]
})
export class ChatModule { }
