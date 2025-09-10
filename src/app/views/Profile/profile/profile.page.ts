import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/Models/User/user.model';
import { UserService } from 'src/app/Services/User/user.service';
import { LucideAngularModule ,Cake , MapPinHouse , Phone , Mail, VenusAndMars , Landmark } from 'lucide-angular';
import { Userdisplay } from 'src/app/Models/User/UserDisplay/userdisplay.model';
import { CleanTitlecasePipe } from "../../../clean-titlecase.pipe";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LucideAngularModule, CleanTitlecasePipe],
  providers: [LoginService, UserService],
})
export class ProfilePage implements OnInit {
  isLoggedIn$: Observable<boolean>;
  readonly Cake = Cake;
  readonly Address = MapPinHouse;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Gender = VenusAndMars;
  readonly Landmark = Landmark;
  constructor(
    private AuthServices: LoginService,
    private route: Router,
    private ngZone: NgZone,
    private UserServices : UserService,
  ) {
    this.isLoggedIn$ = this.AuthServices.isAuthenticated$;
  }

  displayUserProfile : Userdisplay ={};
  LoggedInID: number | undefined = undefined;

  ngOnInit() {
    this.AuthServices.loadAuthState();
    this.AuthServices.getUserFromAPI().subscribe((LoggedInUser) => {
      this.displayUserProfile = LoggedInUser;
    });
  }

  logout() {
    this.AuthServices.logout().subscribe(() => {
      this.ngZone.run(() => this.route.navigate(['/']));
    });
  }
}
