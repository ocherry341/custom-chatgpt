import { NgModule } from '@angular/core';
import { DataTableModule } from 'ng-devui';
import { SharedModule } from 'src/app/@shared/shared.module';
import { LogitBiasEditorComponent } from './logit-bias-editor.component';

@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
  ],
  declarations: [
    LogitBiasEditorComponent,
  ],
  exports: [
    LogitBiasEditorComponent
  ]
})
export class LogitBiasEditorModule { }
