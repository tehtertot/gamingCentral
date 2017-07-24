import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { EqualValidator } from './equal-validator.directive';

import { UserService } from './users/user.service';
import { GamesService } from './game-nav/games.service';
import { IncanSocketsService } from './incan-gold/sockets.service';
import { MachiKoroSocketsService } from './machi/sockets.service';

import { AppComponent } from './app.component';

import { GameNavComponent } from './game-nav/game-nav.component';

import { UsersComponent } from './users/users.component';
import { LoginComponent } from './users/login/login.component';

import { SevenWondersComponent } from './seven-wonders/seven-wonders.component';
import { IncanGoldComponent } from './incan-gold/incan-gold.component';
import { MachiComponent } from './machi/machi.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    GameNavComponent,
    SevenWondersComponent,
    LoginComponent,
    EqualValidator,
    IncanGoldComponent,
    MachiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [UserService,
              GamesService,
              IncanSocketsService,
              MachiKoroSocketsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
