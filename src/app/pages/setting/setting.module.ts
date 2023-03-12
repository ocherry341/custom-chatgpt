import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataTableModule } from 'ng-devui';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from 'src/app/@shared/shared.module';
import { LogitBiasListPipe } from './pipes/logit-bias-list.pipe';
import { SettingComponent } from './setting.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MarkdownModule.forChild(),
    DataTableModule,
  ],
  declarations: [SettingComponent, LogitBiasListPipe],
  exports: [SettingComponent]
})
export class SettingModule { }
