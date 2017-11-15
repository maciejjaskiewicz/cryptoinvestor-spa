import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule,
  MatInputModule, MatListModule, MatMenuModule, MatCardModule,
  MatSidenavModule, MatTooltipModule, MatSelectModule, MatChipsModule,
  MatDialogModule, MatSnackBarModule, MatGridListModule, MatTabsModule,
  MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule,
    MatInputModule, MatListModule, MatMenuModule, MatCardModule,
    MatSidenavModule, MatTooltipModule, MatSelectModule, MatChipsModule,
    MatDialogModule, MatSnackBarModule, MatGridListModule, MatTabsModule,
    MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule
  ],
  exports: [
    MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule,
    MatInputModule, MatListModule, MatMenuModule, MatCardModule,
    MatSidenavModule, MatTooltipModule, MatSelectModule, MatChipsModule,
    MatDialogModule, MatSnackBarModule, MatGridListModule, MatTabsModule,
    MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule
  ],
})
export class MaterialModule { }
