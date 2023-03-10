import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, FormLayout, ToastService } from 'ng-devui';
import { Observable } from 'rxjs';
import { LocalStorageService, StoreService } from 'src/app/@core/services';
import { HttpApiService } from 'src/app/@core/services/http-api.service';
import { SettingOption } from 'src/app/@shared/models/setting.model';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  @ViewChild('saveDialog', { read: TemplateRef }) saveDialog: TemplateRef<void>;
  @ViewChild('saveInput', { read: ElementRef }) saveInput: ElementRef<HTMLInputElement>;

  constructor(
    private store: StoreService,
    private storage: LocalStorageService,
    private dialogService: DialogService,
    private toastService: ToastService,
    private api: HttpApiService,
  ) { }

  formLayout: FormLayout = FormLayout.Vertical;

  option: SettingOption;

  stopTags: Array<{ name: string; }> = [];

  systemPlaceholder: string = `The content of the role 'system', set the behavior of the assistant.\n\ne.g. "You are a helpful assistant."`;
  stopPlaceholder: string = `up to 4 sequences \n\ne.g. ["\\n","?","."] \nThe generated text will stop at the sequences.`;
  biasPlaceholder: string = `{ [ tokenID: number ]: number } \nEach value range from -100 to 100 \n\ne.g. {5171: -100, 470: -100} \nThe token IDs for "can't" are [5171, 470]. \nThe generated text will be unlikely to contain the word "can't".`;

  bodyStr: string = '';

  private getStopTags(stop: string[] | undefined): Array<{ name: string; }> {
    if (stop) {
      return stop.map(str => ({ name: str }));
    } else {
      return [];
    }
  }

  private getOption(): SettingOption {
    const option = this.storage.get('CURRENT_OPTION');
    if (option) {
      this.store.setSettingOption(option);
    }
    const value = this.store.getSettingOption().getValue();
    return JSON.parse(JSON.stringify(value));
  }

  stopTagsChange(e: Array<{ name: string; }>) {
    this.option.apiOptions.stop.value = e.map(tag => tag.name);
    this.submit(this.option);
  }

  temperatureChange(e: boolean, field: 'temperature' | 'top_p') {
    if (e) {
      this.option.apiOptions.top_p.use = field !== 'temperature';
      this.option.apiOptions.temperature.use = field !== 'top_p';
    }
  }

  submit(option: SettingOption) {
    this.store.setSettingOption(option);
  }

  save() {
    const dialog = this.dialogService.open({
      id: 'save-option',
      title: '保存',
      contentTemplate: this.saveDialog,
      buttons: [
        {
          text: '确定',
          cssClass: 'primary',
          handler: () => {
            this.saveOptions(this.saveInput.nativeElement.value)
              .subscribe(() => {
                this.toastService.open({ value: [{ summary: '已保存', severity: 'success', life: 4500 }] });
                dialog.modalInstance.hide();
              });
          }
        },
        {
          text: '取消',
          cssClass: 'common',
          handler: () => {
            dialog.modalInstance.hide();
          }
        }
      ],
    });
    setTimeout(() => {
      this.saveInput.nativeElement.focus();
    });
  }

  saveOptions(value: string) {
    return new Observable(observe => {
      const title = value.trim();
      if (!title) {
        observe.error();
        return;
      }
      const savedOptions = this.storage.get('CHAT_OPTIONS');
      if (!savedOptions) {
        this.storage.set('CHAT_OPTIONS', [{ title, option: this.option }]);
      } else {
        savedOptions.push({ title, option: this.option });
        this.storage.set('CHAT_OPTIONS', savedOptions);
      }
      observe.next();
      observe.complete();
    });

  }

  copyBody() {
    const body = this.api.getBody(this.store.getSettingValue());
    body.messages.push({ role: 'user', content: '${your text}' });
    navigator.clipboard.writeText(JSON.stringify(body));
    this.toastService.open({ value: [{ summary: '已复制', severity: 'success', life: 4500 }] });
    console.log(body);
  }

  setDefault() {
    const apikey = this.option.apikey.value;
    this.option = this.store.getDefaultOption(apikey);
    this.submit(this.option);
  }

  ngOnInit() {
    this.option = this.getOption();
    this.stopTags = this.getStopTags(this.option.apiOptions.stop.value);
  }

}
