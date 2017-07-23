import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './users/login/login.component';
import { GameNavComponent } from './game-nav/game-nav.component';

import { IncanGoldComponent} from './incan-gold/incan-gold.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'games', component: GameNavComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'incan/:game_cap/:game_id', component: IncanGoldComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
