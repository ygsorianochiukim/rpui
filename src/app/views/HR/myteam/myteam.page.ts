import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonSelectOption,
  IonList,
  IonItem,
  IonSelect, IonAlert } from '@ionic/angular/standalone';
import { UserService } from 'src/app/Services/User/user.service';
import { User } from 'src/app/Models/User/user.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Teamaccess } from 'src/app/Models/TeamAccess/teamaccess';
import { TeamaccessService } from 'src/app/Services/TeamAccess/teamaccess.service';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { TeamList } from 'src/app/Models/TeamHeirarchy/team-list';
import { LucideAngularModule , Trash2 } from 'lucide-angular';
import { ModalComponent } from "src/app/shared/modal/modal.component";
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CleanTitlecasePipe } from "../../../clean-titlecase.pipe";

@Component({
  selector: 'app-myteam',
  templateUrl: './myteam.page.html',
  styleUrls: ['./myteam.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LucideAngularModule,
    ModalComponent,
    CleanTitlecasePipe
],
  providers: [UserService, TeamaccessService, LoginService],
})
export class MyteamPage implements OnInit {
  readonly Trash = Trash2;
  listisVisible: boolean = false;
  listtitleHeader: string = 'Users List'
  selectedUsers: number[] = [];
  selectedUserObjects: any[] = [];
  constructor(
    private UserServices: UserService,
    private TeamAccessServices: TeamaccessService,
    private AuthServices : LoginService,
    private Router : Router,
    private alertController : AlertController,
    private cdr: ChangeDetectorRef
  ) {}
  searchTerm: string = '';
  filteredUsers: any[] = [];
  nameSelected: string = '';
  UserList: User[] = [];
  teamAccess: Teamaccess[] = [];
  MyTeamField: Teamaccess = {
    s_bpartner_employee_id: 0,
    supervisor_id: 0,
    created_by: 0,
  };
  displayTeamList: TeamList [] = [];
  myTeam: number[] = [];

  User: any;
  UserID: number = 0;

  ngOnInit() {
    this.displayDropDown();
    this.fetchLoggedInUser();
    this.displayTeam();
    this.filteredUsers = this.UserList;
  }
  filterUsers() {
    const term = this.searchTerm.toLowerCase();

    this.filteredUsers = this.UserList.filter(user =>
      (user.firstname + ' ' + user.lastname).toLowerCase().includes(term)
    );
  }
  closeNoteModal(){
    this.listisVisible = false;
  }
  openList() {
    this.filteredUsers = this.UserList;
    this.searchTerm = '';
    this.listisVisible = true;
  }
  isAllSelected(): boolean {
    return this.filteredUsers.length > 0 &&
          this.filteredUsers.every(u => this.selectedUsers.includes(u.s_bpartner_employee_id));
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.filteredUsers.forEach(user => {
        if (!this.selectedUsers.includes(user.s_bpartner_employee_id)) {
          this.selectedUsers.push(user.s_bpartner_employee_id);
          this.selectedUserObjects.push(user);
        }
      });
    } else {
      this.selectedUsers = this.selectedUsers.filter(id =>
        !this.filteredUsers.some(u => u.s_bpartner_employee_id === id)
      );
      this.selectedUserObjects = this.selectedUserObjects.filter(u =>
        !this.filteredUsers.some(fu => fu.s_bpartner_employee_id === u.s_bpartner_employee_id)
      );
    }
    this.nameSelected = this.getSelectedNames();
  }
  fetchLoggedInUser(){
    this.AuthServices.getUserFromAPI().subscribe((LoggedInUser) => {
      this.User = LoggedInUser;
      this.UserID = this.User?.s_bpartner_employee_id;
      this.TeamAccessServices.teamList(this.UserID).subscribe((data : TeamList[]) => {
        this.displayTeamList = data;
      })
    });
  }
  getId(s_bpartner_employee_id: number) {
    const selectedUser = this.UserList.find(u => u.s_bpartner_employee_id === s_bpartner_employee_id);

    if (selectedUser) {
      this.nameSelected = `${selectedUser.firstname} ${selectedUser.lastname}`;
      this.MyTeamField.s_bpartner_employee_id = selectedUser.s_bpartner_employee_id!;
      this.listisVisible = false;
    }
  }
  selectUser(event: any) {
    this.myTeam = event.detail.value;
  }

  displayDropDown() {
    this.UserServices.displayuserList().subscribe((data) => {
      this.UserList = data;
    });
  }
  async confirmBeforeSubmit() {
    const alert = await this.alertController.create({
      header: 'Access added complete!',
      message: 'Do you want to save this new access?',
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
            this.SetTeam();
            this.displayTeam();
            this.Router.navigate(['/myteam']);
          },
        },
      ],
    });

    await alert.present();
  }
  SetTeam() {
    if (this.selectedUsers.length === 0) {
      console.log("No users to assign");
      return;
    }

    this.selectedUsers.forEach(userId => {
      this.MyTeamField = {
        s_bpartner_employee_id: userId,
        supervisor_id: this.UserID,
        created_by: this.UserID,
      };

      this.TeamAccessServices.addNewTask(this.MyTeamField).subscribe({
        next: () => {
          this.displayTeam();
        },
        error: (err) => console.error("Error adding new task", err),
      });
    });
    this.selectedUsers = [];
    this.selectedUserObjects = [];
    this.nameSelected = '';
  }
  toggleSelection(user: any, event: any) {
    if (event.target.checked) {
      if (!this.selectedUsers.includes(user.s_bpartner_employee_id)) {
        this.selectedUsers.push(user.s_bpartner_employee_id);
        this.selectedUserObjects.push(user);
      }
    } else {
      this.selectedUsers = this.selectedUsers.filter(id => id !== user.s_bpartner_employee_id);
      this.selectedUserObjects = this.selectedUserObjects.filter(u => u.s_bpartner_employee_id !== user.s_bpartner_employee_id);
    }
    this.nameSelected = this.getSelectedNames();
  }

  getSelectedNames(): string {
    return this.selectedUserObjects.map(u => `${u.firstname} ${u.lastname}`).join(', ');
  }

  assignSelected() {
    if (this.selectedUsers.length === 0) {
      console.log("No users selected");
      return;
    }
    this.nameSelected = this.getSelectedNames();
    console.log("Selected users (pending save):", this.selectedUserObjects);
    this.closeNoteModal();
  }

  displayTeam(){
    this.TeamAccessServices.teamList(this.UserID).subscribe((data : TeamList[]) => {
      this.displayTeamList = data;
      this.cdr.detectChanges();
    });
  }

  remove(id:number){
    this.TeamAccessServices.removeTeam(id).subscribe(()=>{
      this.displayTeam();
    })
  }
}
