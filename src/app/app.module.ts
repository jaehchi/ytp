import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AliasService } from './alias.service';
import { KeysService } from './keys.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommandComponent } from './command/command.component';

import { AutofocusDirective } from './autofocus.directive';

@NgModule({
  declarations: [
    AppComponent,
    CommandComponent,
    AutofocusDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    AppRoutingModule,
  ],
  providers: [KeysService, AliasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
