import { Component, OnInit } from '@angular/core';
import { FormLayout } from 'ng-devui';
import { Setting } from 'src/app/@shared/models/setting.model';

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
    use: 'temperature',
    temperature: 0.7,
    top_p: 1,
    max_tokens: 4096,
    n: 1,
  };

  ngOnInit() {
  }

}
