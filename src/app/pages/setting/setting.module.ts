import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from 'src/app/@shared/shared.module';
import { SettingComponent } from './setting.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MarkdownModule.forChild()
  ],
  declarations: [SettingComponent],
  exports: [SettingComponent]
})
export class SettingModule { }
