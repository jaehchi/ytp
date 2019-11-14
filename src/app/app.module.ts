import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';

import { AliasService } from './alias.service';
import { KeysService } from './keys.service';
import { AutofocusDirective } from './autofocus.directive';

import { AppComponent } from './app.component';
import { CommandComponent } from './command/command.component';
import { KeyBindingDialogComponent } from './key-binding-dialog/key-binding-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    CommandComponent,
    AutofocusDirective,
    KeyBindingDialogComponent,
  ],
  entryComponents: [
    KeyBindingDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FontAwesomeModule,
    AppRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [KeysService, AliasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
