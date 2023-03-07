import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputNumberModule, SelectModule, SliderModule, ToggleModule } from 'ng-devui';
import { SharedModule } from 'src/app/@shared/shared.module';
import { SettingComponent } from './setting.component';

@NgModule({
  imports: [
    SharedModule,
    SliderModule,
    InputNumberModule,
    SelectModule,
    ToggleModule,
    RouterModule
  ],
  declarations: [SettingComponent],
  exports: [SettingComponent]
})
export class SettingModule { }
