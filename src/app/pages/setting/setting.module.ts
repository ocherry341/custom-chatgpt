import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from 'src/app/@shared/shared.module';
import { LogitBiasEditorModule } from './components/logit-bias-editor/logit-bias-editor.module';
import { SettingComponent } from './setting.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MarkdownModule.forChild(),
    LogitBiasEditorModule,
  ],
  declarations: [
    SettingComponent,
  ],
  exports: [SettingComponent]
})
export class SettingModule { }
