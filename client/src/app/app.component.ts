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
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule ],
  templateUrl: './app.component.html',
  providers: [UserService],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public title = 'Granja TFM';
  public user: User;
  public identity: any;
  public token: any;

  constructor(private _userService: UserService) {
    this.user = new User('','','','','','ROL_user','');
  }

  ngOnInit() {
  }

  public onSubmit() { 
    console.log(this.user);
    this._userService.signup(this.user).subscribe( 
      response => { 
        console.log(response);
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          console.log(error);
        }
      }
    );
  }
}
