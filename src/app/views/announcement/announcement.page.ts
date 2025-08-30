import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonDatetime } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AnnouncementService } from 'src/app/Services/Announcement/announcement.service';
import { Announcement } from 'src/app/Models/Announcement/announcement';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
  standalone: true,
  imports: [IonDatetime, CommonModule, FormsModule, HttpClientModule],
  providers: [AnnouncementService, LoginService]
})
export class AnnouncementPage implements OnInit {

  AnnouncementField: Announcement = {
    announcement_description: '',
    date_validity: new Date,
    created_by: 0
  }
  UserLoggedIn: any;
  userID: any;

  constructor(private AnnouncementServices : AnnouncementService, private AuthServices : LoginService, private Routes : Router) { }
  ngOnInit() {
    this.AuthServices.getUserFromAPI().subscribe((LoggedInUser) => {
      this.UserLoggedIn = LoggedInUser;
      this.userID = this.UserLoggedIn.s_bpartner_employee_id;
    });
  }

  newAnnouncement(){
    this.AnnouncementField.created_by = this.userID;
    this.AnnouncementServices.addNewAnnouncement(this.AnnouncementField).subscribe(() => {
      this.Routes.navigate(['/home']);
    });
  }

}
