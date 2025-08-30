import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { LoginService } from '../Services/Auth/login.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [ HttpClientModule],
  providers: [LoginService]
})
export class HomePage {

  User : any;
  Name : string = "Sample Name";
  constructor(private AuthServices : LoginService) {}

  sample(){
    console.log('sample');
  }

  fetchUser(){
    this.AuthServices.getUserFromAPI().subscribe((Userdata) => {
      this.User = Userdata;
    });
  }
}
