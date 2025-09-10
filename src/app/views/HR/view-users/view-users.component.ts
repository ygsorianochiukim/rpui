import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from 'src/app/Models/User/user.model';
import { UserService } from 'src/app/Services/User/user.service';
import { LucideAngularModule , FunnelIcon , Plus, Eye } from "lucide-angular";
import { Router, RouterLink } from '@angular/router';
import { CleanTitlecasePipe } from 'src/app/clean-titlecase.pipe';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss'],
  imports: [CleanTitlecasePipe, CommonModule, FormsModule, HttpClientModule, LucideAngularModule],
  providers:[UserService],
})
export class ViewUsersComponent  implements OnInit {

  readonly Funnel = FunnelIcon;
  readonly Plus = Plus;
  readonly Eye = Eye;
  UserList: User[] =[];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(
    private UserServices : UserService,
    private Router : Router,) { }

  ngOnInit() {
    this.displayUserList();
  }
  displayUserList(){
    this.UserServices.displayuserList().subscribe((data) => {
      this.UserList = data;
      this.filteredUsers = data;
    });
  }
  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.UserList.filter(user =>
      (user.companyname?.toLowerCase().includes(term) || 
       user.lastname?.toLowerCase().includes(term))
    );
  }

  viewinformation(s_bpartner_employee_id: number){
    if (s_bpartner_employee_id) {
      this.Router.navigate(['/userinformation/',s_bpartner_employee_id]);
    }
  }
}
