import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DevUIGlobalConfig, DevUIGlobalConfigToken } from 'ng-devui/utils';
import { MarkdownModule } from 'ngx-markdown';
import { CoreModule } from './@core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './pages/chat/chat.module';
import { SettingModule } from './pages/setting/setting.module';

const PAGES_MODULES = [
  SettingModule,
  ChatModule
];

const GLOBAL_CONFIG: DevUIGlobalConfig = {
  global: {
    size: 'lg',
    styleType: 'gray'
  },

};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...PAGES_MODULES,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    MarkdownModule.forRoot(),
  ],
  providers: [
    {
      provide: DevUIGlobalConfigToken,
      useValue: GLOBAL_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
