import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  luser: User = new User();
  ruser: User = new User();
  lerror: String;
  rerror: String;

  constructor(private _user: UserService, private _router: Router) { }

  login() {
    this._user.login(this.luser)
    .then(() => { this._router.navigate(['/games']) })
    .catch((err) => { 
      if (err.status == '400') {
        this.lerror = "No user registered with that email.";
      }
      else if (err.status == '401') {
        this.lerror = "Password is incorrect";
      } 
      else {
        this.lerror = "Error attempting to log in."
      }
    });
  }

  register() {
    this._user.register(this.ruser)
    .then(() => { this._router.navigate(['/games']); })
    .catch((err) => { console.log(err); });
  }

}
