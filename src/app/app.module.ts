import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { UserService } from './users/user.service';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent
  ], exports: [
    UsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  //  UsersComponent
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
