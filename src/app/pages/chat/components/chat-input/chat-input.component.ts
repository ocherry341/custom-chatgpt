import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, ModalComponent, ToastService } from 'ng-devui';
import { LocalStorageService, StoreService } from 'src/app/@core/services';
import { HttpApiService } from 'src/app/@core/services/http-api.service';
import { SavedSettingOption } from 'src/app/@shared/models/setting.model';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {

  @ViewChild('optionsList', { read: TemplateRef }) optionsList: TemplateRef<void>;
  // @HostListener('window:keyup', ['$event'])
  // enter(e: KeyboardEvent) {
  //   if (e.key === 'Enter') {
  //     this.chat();
  //   }
  // }

  constructor(
    private http: HttpApiService,
    private store: StoreService,
    private storage: LocalStorageService,
    private dialogService: DialogService,
    private toastService: ToastService
  ) { }

  chatInput: string;
  settingOptions: SavedSettingOption[] = [];
  dialog: ModalComponent;
  generating: boolean = false;

  showOptions() {
    this.dialog = this.dialogService.open({
      id: 'op',
      title: '保存的配置',
      contentTemplate: this.optionsList,
      width: '320px',
      buttons: []
    }).modalInstance;
  }

  removeOptions(index: number) {
    this.settingOptions.splice(index, 1);
    this.storage.set('CHAT_OPTIONS', this.settingOptions);
    if (this.settingOptions.length === 0) {
      this.dialog.hide();
    }
  }

  selectOption(savedOption: SavedSettingOption) {
    this.store.setSettingOption(savedOption.option);
    this.storage.set('CURRENT_OPTION', savedOption.option);
    this.dialog.hide();
    this.toastService.open({
      value: [{
        content: `载入配置 ${savedOption.title}`,
        severity: 'success',
      }]
    });
  }

  enter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.chat();
    }
  }

  preventEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }


  textInput() {
    // this.chatInput.nativeElement.style.height = `${this.chatInput.nativeElement.scrollHeight}px`;
  }

  chat() {
    if (!this.generating && this.chatInput) {
      this.store.pushChatMessages({ role: 'user', content: this.chatInput });
      this.chatInput = '';
      this.generating = true;
      this.http.chat(this.chatInput)
        .subscribe({
          next: (res) => {
            const msg = res.choices[0].message ?? { role: 'assistant', content: 'err' };
            this.store.pushChatMessages(msg);
            this.generating = false;
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.error.error.message);
          },
        });
    }

  }

  clear() {
    this.store.setChatMessages([]);
  }

  ngOnInit() {
    const options = this.storage.get('CHAT_OPTIONS');
    if (options) {
      this.settingOptions = options;
    }
    const currentOption = this.storage.get('CURRENT_OPTION');
    if (currentOption) {
      this.store.setSettingOption(currentOption);
    }
  }

}
