import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ChatComponent } from './chat.component';


@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MarkdownModule.forChild()
  ],
  declarations: [
    ChatComponent,
  ],
  exports: [ChatComponent],
})
export class ChatModule { }
