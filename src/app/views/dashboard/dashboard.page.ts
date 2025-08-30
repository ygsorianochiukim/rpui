import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LucideAngularModule , Menu, UserIcon, CircleUserRound, Megaphone , History, Church } from 'lucide-angular';
import { HamburgerComponent } from "src/app/shared/hamburger/hamburger.component";
import { RouterLink } from '@angular/router';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AnnouncementService } from 'src/app/Services/Announcement/announcement.service';
import { Announcement } from 'src/app/Models/Announcement/announcement';
import { AppComponent } from 'src/app/app.component';
import { VerseService } from 'src/app/Services/Verse/verse.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink, HttpClientModule],
  providers: [LoginService, AnnouncementService, AppComponent]
})
export class DashboardPage implements OnInit {
  readonly Menu = Menu;
  readonly Megaphone = Megaphone;
  readonly Church = Church;
  readonly History = History;
  readonly CircleUserRound = CircleUserRound;
  User : any;
  Name : string = "";
  AnnouncementList: Announcement[] =[];
  verse?: {ref:string,text:string};
  constructor(private AuthServices : LoginService, private AnnouncmentServices : AnnouncementService,private verseServices: VerseService) {}
  ngOnInit(): void {
    this.fetchUser();
    this.displayAnnouncement();
    this.ionViewWillEnter();
  }
  async ionViewWillEnter() {
    this.verse = this.verseServices.getLocalVerseFor();
  }
  displayAnnouncement(){
    this.AnnouncmentServices.displayAnnouncement().subscribe((data) => {
      this.AnnouncementList = data;
    })
  }

  fetchUser(){
    this.AuthServices.getUserFromAPI().subscribe((Userdata) => {
      this.User = Userdata;
      this.Name = this.User.firstname + " " + this.User.lastname;
    });
  }

}
