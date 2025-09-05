import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accessline } from 'src/app/Models/AccessLine/accessline.model';
import { Position } from 'src/app/Models/Position/position';
import { User } from 'src/app/Models/User/user.model';
import { Useraccess } from 'src/app/Models/UserAccess/useraccess.model';
import { AccessLineService } from 'src/app/Services/AccessLine/access-line.service';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { PositionService } from 'src/app/Services/Position/position.service';
import { UserService } from 'src/app/Services/User/user.service';
import { AccessService } from 'src/app/Services/UserAccess/access.service';
import {
  IonText,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonAlert,
  AlertController,
} from '@ionic/angular/standalone';
import type { OverlayEventDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { TaskPositionService } from 'src/app/Services/Task/DefaultTask/task-position.service';
@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss'],
  imports: [
    IonSelectOption,
    IonSelect,
    IonList,
    IonItem,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ModalComponent,
  ],
  providers: [
    UserService,
    PositionService,
    AccessService,
    AccessLineService,
    LoginService,
    TaskPositionService
  ],
})
export class UserAccessComponent implements OnInit {
  constructor(
    private userServices: UserService,
    private PositionServices: PositionService,
    private UserAccessServices: AccessService,
    private AccessLineServices: AccessLineService,
    private AuthServices: LoginService,
    private Routes: Router,
    private alertController: AlertController,
    private TaskPositionServices: TaskPositionService
  ) {}

  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }
  listisVisible: boolean = false;
  listtitleHeader: string = 'Users List';
  searchTerm: string = '';
  filteredUsers: any[] = [];
  nameSelected: string = '';
  UserList: User[] = [];
  PositionList: Position[] = [];
  accessType: string[] = [];
  UserAccess: Useraccess = {
    s_bpartner_employee_id: 0,
    position_id: '',
    created_by: 0,
  };
  UserAccessLineFields: Accessline = {
    s_bpartner_employee_id: 0,
    access_type: '',
    created_by: 0,
  };
  User: any;
  UserID: number = 0;
  rows: any;
  headers: any;
  ngOnInit() {
    this.dropdownUser();
    this.fetchUser();
    this.displayPosition();
    this.filteredUsers = this.UserList;
  }

  closeNoteModal() {
    this.listisVisible = false;
  }
  openList() {
    this.listisVisible = true;
  }
  filterUsers() {
    const term = this.searchTerm.toLowerCase();

    this.filteredUsers = this.UserList.filter((user) =>
      (user.firstname + ' ' + user.lastname).toLowerCase().includes(term)
    );
  }
  fetchUser() {
    this.AuthServices.getUserFromAPI().subscribe((UserLoggedIn) => {
      this.User = UserLoggedIn;
      this.UserID = this.User?.s_bpartner_employee_id;
      this.UserAccess.created_by = this.UserID;
      this.UserAccessLineFields.created_by = this.UserID;
    });
  }

  dropdownUser() {
    this.userServices.displayuserList().subscribe((data) => {
      this.UserList = data;
    });

    this.PositionServices.displayPosition().subscribe((data) => {
      this.PositionList = data;
    });
  }

  getId(s_bpartner_employee_id: number) {
    const selectedUser = this.UserList.find(
      (u) => u.s_bpartner_employee_id === s_bpartner_employee_id
    );

    if (selectedUser) {
      this.nameSelected = `${selectedUser.firstname} ${selectedUser.lastname}`;
      this.UserAccessLineFields.s_bpartner_employee_id =
        selectedUser.s_bpartner_employee_id!;
      this.UserAccess.s_bpartner_employee_id =
        selectedUser.s_bpartner_employee_id!;
      this.listisVisible = false;
    }
  }
  Insert() {
    this.accessType.push('Insert');
    console.log(this.accessType);
  }
  Update() {
    this.accessType.push('Update');
  }
  Remove() {
    this.accessType.push('Remove');
  }
  displayPosition() {
    this.TaskPositionServices.getSheetData().subscribe((data: any) => {
      const headers = data[0];
      const display = data.slice(1);
      this.rows = display
        .filter((r: string[]) => r[1] && r[1].trim() !== '')
        .map((row: string[]) => {
          let obj: any = {};
          headers.forEach((h: string, i: number) => {
            obj[h] = row[i] || '';
          });
          return obj;
        });
      this.headers = headers;
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
            this.newUserAccess();
            this.Routes.navigate(['/viewEmployee']);
          },
        },
      ],
    });

    await alert.present();
  }
  newUserAccess() {
    this.UserAccessServices.newuserAccess(this.UserAccess).subscribe(
      (AccessResponse: any) => {
        const accessID = AccessResponse.emp_i_user_access_id;
        this.UserAccessLineFields.s_bpartner_employee_id =
          this.UserAccess.s_bpartner_employee_id;
        for (let i = 0; i < this.accessType.length; i++) {
          this.UserAccessLineFields.access_type = this.accessType[i];
          this.AccessLineServices.newAccessLine(
            this.UserAccessLineFields
          ).subscribe(() => {
            this.Routes.navigate(['/viewEmployee']);
          });
        }
      }
    );
  }
}
