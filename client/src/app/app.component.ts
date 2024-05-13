import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { RouterOutlet } from '@angular/router';
import { User } from './models/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  providers: [UserService],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Granja TFM';
  public user: User;
  public identity: any;
  public token: any;
  public errorMessage: any;

  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROL_user', '');
  }

  ngOnInit() {}

  public onSubmit() {
    console.log(this.user);
    this._userService.signup(this.user).subscribe(
      response => {
          let identity = response.user;
          this.identity = identity;
          if (!this.identity._id) {
            alert("El usuario no está correctamente identificado");
          } else {
            this._userService.signup(this.user, true).subscribe(
              response => {
                  let token = response.token;
                  this.token = token;
                  if (this.token.length <= 0) {
                    alert("El token no se ha generado correctamente");
                  } else {
                    console.log(token);
                    console.log(identity);  
                  }
              },
              error => {
                if (error.error && error.error.message) {
                  this.errorMessage = error.error.message;
                } else {
                  this.errorMessage = 'Error desconocido';
                }
                console.log(error);
              }
            );  
          }
      },
      error => {
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Error desconocido';
        }
        console.log(error);
      }
    );
  }
}
