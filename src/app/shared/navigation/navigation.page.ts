import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  Users,
  ListChecks,
  IdCardLanyard,
  ShieldUser,
  BriefcaseBusiness,
  ListPlus,
  ChartArea,
  View,
  ArrowLeft,
  Menu,
  Network,
  Megaphone
} from 'lucide-angular';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, HttpClientModule],
  providers: [LoginService]
})
export class NavigationPage implements OnInit {
  readonly Network = Network;
  readonly Megaphone = Megaphone;
  readonly Users = Users;
  readonly IdCardLanyard = IdCardLanyard;
  readonly ListChecks = ListChecks;
  readonly ShieldUser = ShieldUser;
  readonly BriefcaseBusiness = BriefcaseBusiness;
  readonly ListPlus = ListPlus;
  readonly View = View;
  readonly ChartArea = ChartArea;
  readonly Home = Home;
  readonly ArrowLeft = ArrowLeft;
  readonly Menu = Menu;
  isHidden: boolean = true;
  role: string = "";
  function: string = "";
  User: any;
  version: string = environment.version;

  constructor(private AuthServices : LoginService) {}
  subList: boolean = false;
  subListHR: boolean = false;
  subListPlanner: boolean = true;

  ngOnInit() {
    this.fetchData();
  }

  fetchData(){
    this.AuthServices.getUserFromAPI().subscribe(userData => {
      this.User = userData;
      this.role = this.User?.user_access.position.department;
      this.function = this.User?.user_access.position.function;
    });
  }
  hide() 
  {
    const nav = document.querySelector('.navigation') as HTMLElement;
    if (nav) {
      nav.classList.add('hide-nav');
      this.isHidden = true;
    }
  }
  show() 
  {
    const nav = document.querySelector('.navigation') as HTMLElement;
    if (nav) {
      nav.classList.remove('hide-nav');
      this.isHidden = false;
    }
  }

  viewSubNav() {
    if (this.subList === false) {
      this.subList = true;
    } else {
      this.subList = false;
    }
  }
  viewSubHR() {
    if (this.subListHR === false) {
      this.subListHR = true;
    } else {
      this.subListHR = false;
    }
  }
}
