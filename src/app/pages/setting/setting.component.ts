import { Component, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui';
import { Setting, SettingUse } from 'src/app/@shared/models/setting.model';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(
  ) { }

  formLayout: FormLayout = FormLayout.Vertical;

  setting: Setting = {
    apikey: '',
    apiurl: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    top_p: 1,
    max_tokens: 4096,
    n: 1,
    presence_penalty: 0,
    frequency_penalty: 0
  };

  use: SettingUse = {
    system: true,
    apikey: true,
    apiurl: true,
    model: true,
    temperature: true,
  };

  tempChange(e: boolean, field: 'temperature' | 'top_p') {
    if (e) {
      this.use['top_p'] = field !== 'temperature';
      this.use['temperature'] = field !== 'top_p';
    }
  }

  private getUse(setting: Setting) {
    let temp: { [key: string]: boolean; } = {};
    Object.entries(setting)
      .forEach(([key, value]: [string, any]) => {
        temp[key] = !!value;
      });
    return temp;
  }

  ngOnInit() {
  }

}
