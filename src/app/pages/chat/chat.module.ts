import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropDownModule } from 'ng-devui';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ChatComponent } from './chat.component';


@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    DropDownModule,
    MarkdownModule.forChild()
  ],
  declarations: [
    ChatComponent,
  ],
  exports: [ChatComponent],
})
export class ChatModule { }
