import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, FormLayout } from 'ng-devui';
import { LocalStorageService, StoreService } from 'src/app/@core/services';
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
  ) { }

  formLayout: FormLayout = FormLayout.Vertical;

  option: SettingOption;

  systemPlaceholder: string = `The content of the role 'system', set the behavior of the assistant.\n\ne.g. "You are a helpful assistant."`;
  stopPlaceholder: string = `up to 4 sequences \n\ne.g. ["\\n","?","."] \nThe generated text will stop at the sequences.`;
  biasPlaceholder: string = `{ [ tokenID: number ]: number } \nEach value range from -100 to 100 \n\ne.g. {5171: -100, 470: -100} \nThe token IDs for "can't" are [5171, 470]. \nThe generated text will be unlikely to contain the word "can't".`;

  tempChange(e: boolean, field: 'temperature' | 'top_p') {
    if (e) {
      this.option.apiOptions.top_p.use = field !== 'temperature';
      this.option.apiOptions.temperature.use = field !== 'top_p';
    }
  }

  submit(option: SettingOption) {
    this.store.setSettingOption(option);
    this.storage.set('CURRENT_OPTION', option);
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
            const title = this.saveInput.nativeElement.value;
            if (!title) return;
            const savedOptions = this.storage.get('CHAT_OPTIONS');
            if (!savedOptions) {
              this.storage.set('CHAT_OPTIONS', [{ title, option: this.option }]);
              dialog.modalInstance.hide();
              return;
            }
            savedOptions.push({ title, option: this.option });
            this.storage.set('CHAT_OPTIONS', savedOptions);
            dialog.modalInstance.hide();
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

  ngOnInit() {
    const option = this.storage.get('CURRENT_OPTION');
    if (option) {
      this.store.setSettingOption(option);
    }
    this.option = this.store.getSettingOption().getValue();
  }

}
