import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, FormModule, LayoutModule, ModalModule, TextInputModule, TextareaModule } from 'ng-devui';

const DEVUI = [
  LayoutModule,
  TextareaModule,
  TextInputModule,
  ButtonModule,
  FormsModule,
  ModalModule,
  FormModule,
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
