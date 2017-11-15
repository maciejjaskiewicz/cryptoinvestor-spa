import { NgModule } from '@angular/core';
import {
  CovalentLayoutModule,
  CovalentStepsModule,
  CovalentMediaModule,
  CovalentDataTableModule,
  CovalentSearchModule,
  CovalentPagingModule,
  CovalentLoadingModule,
  CovalentDialogsModule
} from '@covalent/core';

@NgModule({
  imports: [
    CovalentLayoutModule,
    CovalentStepsModule,
    CovalentMediaModule,
    CovalentDataTableModule,
    CovalentSearchModule,
    CovalentPagingModule,
    CovalentLoadingModule,
    CovalentDialogsModule
  ],
  exports: [
    CovalentLayoutModule,
    CovalentStepsModule,
    CovalentMediaModule,
    CovalentDataTableModule,
    CovalentSearchModule,
    CovalentPagingModule,
    CovalentLoadingModule,
    CovalentDialogsModule
  ],
})
export class CovalentModule { }
