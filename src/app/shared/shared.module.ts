import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CovalentModule } from './covalent.module';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    FlexLayoutModule,
    CovalentModule,
    MaterialModule
  ],
  providers: []
})

export class SharedModule { }
