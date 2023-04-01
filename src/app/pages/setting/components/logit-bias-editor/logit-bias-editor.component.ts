import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { decode, encode } from '@nem035/gpt-3-encoder';

interface LogitBias {
  [key: number]: number;
}

interface LogitBiasItem {
  tokenID: number[];
  text: string;
  bias: number;
}

@Component({
  selector: 'app-logit-bias-editor',
  templateUrl: './logit-bias-editor.component.html',
  styleUrls: ['./logit-bias-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LogitBiasEditorComponent),
    multi: true,
  }]
})
export class LogitBiasEditorComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  logitBiasList: LogitBiasItem[] = [];

  private convertLogitBiasListToMap(list: LogitBiasItem[]): LogitBias {
    const map: LogitBias = {};
    list.forEach(item => {
      item.tokenID.forEach(id => {
        map[id] = item.bias;
      });
    });
    return map;
  }

  private convertLogitBiasMapToList(map: LogitBias): LogitBiasItem[] {
    const list: LogitBiasItem[] = [];
    Object.keys(map).forEach(key => {
      const tokenID = parseInt(key);
      const bias = map[tokenID];
      const text = decode([tokenID]);
      const logitBiasItem: LogitBiasItem = {
        tokenID: [tokenID],
        text,
        bias,
      };
      list.push(logitBiasItem);
    });
    return list;
  }

  writeValue(obj: LogitBias): void {
    if (!obj) return;
    this.logitBiasList = this.convertLogitBiasMapToList(obj);
  }

  registerOnChange(fn: any): void {
    this.submit = (list: LogitBiasItem[]) => {
      fn(this.convertLogitBiasListToMap(list));
    };
  }
  registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  ngOnInit() {
  }

  addLogitBias(tokenStr: string, biasValue: number) {
    if (!tokenStr || biasValue == undefined) return;
    const logitBiasItem: LogitBiasItem = {
      tokenID: encode(tokenStr),
      text: tokenStr,
      bias: biasValue,
    };
    this.logitBiasList.push(logitBiasItem);
    this.submit(this.logitBiasList);
  }

  removeLogitBias(rowIndex: number) {
    this.logitBiasList.splice(rowIndex, 1);
    this.submit(this.logitBiasList);
  }

  removeAllLogitBias() {
    this.logitBiasList = [];
    this.submit(this.logitBiasList);
  }

  submit(list: LogitBiasItem[]) { }

  touched() { }

}
