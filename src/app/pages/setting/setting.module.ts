import { NgModule } from '@angular/core';
import { InputNumberModule, SelectModule, SliderModule, TabsModule } from 'ng-devui';
import { SharedModule } from 'src/app/@shared/shared.module';
import { SettingComponent } from './setting.component';

@NgModule({
  imports: [
    SharedModule,
    SliderModule,
    InputNumberModule,
    SelectModule,
    TabsModule
  ],
  declarations: [SettingComponent],
  exports: [SettingComponent]
})
export class SettingModule { }
