import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/@shared/shared.module';
import { SettingComponent } from './setting.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [SettingComponent],
  exports: [SettingComponent]
})
export class SettingModule { }
