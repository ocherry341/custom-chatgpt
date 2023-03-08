import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, DataTableModule, FormModule, IconModule, InputNumberModule, LayoutModule, ModalModule, SelectModule, TextInputModule, TextareaModule, ToastModule, ToggleModule, TooltipModule } from 'ng-devui';

const DEVUI = [
  LayoutModule,
  TextareaModule,
  TextInputModule,
  ButtonModule,
  FormsModule,
  ModalModule,
  FormModule,
  TooltipModule,
  IconModule,
  InputNumberModule,
  SelectModule,
  ToggleModule,
  DataTableModule,
  ToastModule,
];

@NgModule({
  imports: [
    CommonModule,
    ...DEVUI,
  ],
  exports: [
    ...DEVUI,
    CommonModule,
  ]
})
export class SharedModule { }
