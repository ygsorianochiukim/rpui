import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/Services/User/user.service';
import { LucideAngularModule ,Cake , MapPinHouse , Phone , Mail, VenusAndMars , Landmark  } from 'lucide-angular';
import { Userdisplay } from 'src/app/Models/User/UserDisplay/userdisplay.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-userinformation',
  templateUrl: './userinformation.page.html',
  styleUrls: ['./userinformation.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, HttpClientModule],
  providers: [UserService]
})
export class UserinformationPage implements OnInit {
  readonly Cake = Cake;
  readonly Address = MapPinHouse;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Gender = VenusAndMars;
  readonly Landmark = Landmark;
  displayUserProfile : Userdisplay ={};
  constructor(private Routes : ActivatedRoute, private userServices : UserService) { }

  IdParam: number =Number(this.Routes.snapshot.paramMap.get('s_bpartner_employee_id')) || 0;
  ngOnInit() {
    this.displayInformation();
  }

  displayInformation(){
    this.userServices.userinformation(this.IdParam).subscribe((data)=>{
      this.displayUserProfile = data;
    });
  }

}
