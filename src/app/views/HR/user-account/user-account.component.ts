import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from 'src/app/Models/User/user.model';
import { UserService } from 'src/app/Services/User/user.service';
import { IonText, IonItem, IonList, IonSelectOption } from "@ionic/angular/standalone";
import { IonSelect } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/Services/Auth/login.service';
@Component({
  selector: 'app-user-account',
  imports: [IonList, IonItem, CommonModule, FormsModule, HttpClientModule, IonSelect, IonSelectOption],
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
  providers: [UserService, LoginService],
  standalone: true,
})
export class UserAccountComponent  implements OnInit {

  constructor(private userServices : UserService, private AuthServices : LoginService) { }

  UserField: User ={
    firstname: '',
    lastname: '',
    birthdate: new Date(),
    sex: '',
    contact_no: 0,
    companyname: '',
    address: '',
    email: '',
    username: '',
    password: '',
    is_active: true
  };
  

  ngOnInit() {}

  addNewUser(){
    this.userServices.addNewUser(this.UserField).subscribe(() =>{

    });
  }

}
