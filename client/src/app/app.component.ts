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
  public user_register: User;

  public identity: any;
  public token: any;
  public alertRegister: any;
  public errorMessage: any;

  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token)
  }

  public onSubmit() {
    console.log(this.user);
    this._userService.signup(this.user).subscribe(
      response => {
          let identity = response.user;
          this.identity = identity;
          if (!this.identity._id) {
            alert("El usuario no está correctamente identificado");
          } else {
                localStorage.setItem('identity', JSON.stringify(identity));
                this._userService.signup(this.user, true).subscribe(
                  response => {
                      let token = response.token;
                      this.token = token;
                      if (this.token.length <= 0) {
                        alert("El token no se ha generado correctamente");
                      } else {
                        localStorage.setItem('token', token);
                        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
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

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

  

  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response => {
          let user = response.user;
          this.user_register = user;
          if(!user._id){
            this.alertRegister = 'Error al registrarse';
          }else{
            this.alertRegister = 'El registro se ha realizado correctamente, identificate con '+this.user_register.email;
            this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
          }
      },
      error => {
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.alertRegister = 'Error desconocido';
        }
        console.log(error);
      }
    );

  }
}
