import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/@shared/shared.module';
import { SettingComponent } from './setting.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
  ],
  declarations: [SettingComponent],
  exports: [SettingComponent]
})
export class SettingModule { }
