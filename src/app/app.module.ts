import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AliasService } from './alias.service';
import { KeysService } from './keys.service';

import { AppComponent } from './app.component';
import { CommandComponent } from './command/command.component';
import { KeyBindingDialogComponent } from './key-binding-dialog/key-binding-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    CommandComponent,
    KeyBindingDialogComponent,
  ],
  entryComponents: [
    KeyBindingDialogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    FontAwesomeModule,
    AppRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,

  ],
  providers: [KeysService, AliasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
