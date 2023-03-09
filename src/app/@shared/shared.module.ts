import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule, DrawerModule, FormModule, IconModule, InputNumberModule, LayoutModule, ModalModule, SelectModule, TagsInputModule, TextInputModule, TextareaModule, ToastModule, ToggleModule, TooltipModule } from 'ng-devui';
import { DrawerListComponent } from './components/drawer-list/drawer-list.component';

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
  ToastModule,
  TagsInputModule,
  DrawerModule,
];

const COMPONENTS = [
  DrawerListComponent
];


@NgModule({
  imports: [
    CommonModule,
    ...DEVUI,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...DEVUI,
    ...COMPONENTS,
    CommonModule,
  ]
})
export class SharedModule { }
