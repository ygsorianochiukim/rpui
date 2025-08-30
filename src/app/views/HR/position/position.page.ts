import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonList,
  IonSelect,
  IonSelectOption,
  IonItem,
  AlertController,
} from '@ionic/angular/standalone';
import { PositionService } from 'src/app/Services/Position/position.service';
import { Position } from 'src/app/Models/Position/position';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { Router } from '@angular/router';
import { LucideAngularModule , Pen } from 'lucide-angular';

@Component({
  selector: 'app-position',
  templateUrl: './position.page.html',
  styleUrls: ['./position.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
    HttpClientModule,
    LucideAngularModule
  ],
  providers: [PositionService, LoginService],
})
export class PositionPage implements OnInit {
  readonly Pen = Pen;
  constructor(
    private PositionServices: PositionService,
    private AuthServcies: LoginService,
    private alertController: AlertController,
    private Routes : Router
  ) {}
  PositionFields: Position = {
    position: '',
    department: '',
    function: '',
    created_by: 0,
  };
  User: any;
  UserID: number = 0;

  positionlist: Position[] = [];

  ngOnInit() {
    this.fetchUser();
    this.fetchPosition();
  }
  fetchUser() {
    this.AuthServcies.getUserFromAPI().subscribe((UserLoggedIn) => {
      this.User = UserLoggedIn;
      this.UserID = this.User?.s_bpartner_employee_id;
      this.PositionFields.created_by = this.UserID;
    });
  }
  fetchPosition(){
    this.PositionServices.displayPosition().subscribe((data) =>{
      this.positionlist = data;
    });
  }
  async confirmBeforeSubmit() {
    const alert = await this.alertController.create({
      message: 'Do you want to save this new position?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Alert canceled'),
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.addNewposition();
            this.Routes.navigate(['/viewEmployee']);
          },
        },
      ],
    });
    await alert.present();
  }
  addNewposition() {
    this.PositionServices.addnewPosition(this.PositionFields).subscribe(
      () => {}
    );
  }
}
