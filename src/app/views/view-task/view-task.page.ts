import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Menu,
  CircleUserRound,
  Funnel,
  Eye,
  Trash
} from 'lucide-angular';
import { TaskService } from 'src/app/Services/Task/task.service';
import { Taskmodel } from 'src/app/Models/Task/taskmodel';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { TaskDueList } from 'src/app/Models/Task/TaskDue/task-due-list';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { TaskComplete } from 'src/app/Models/Task/Complete/task-complete.model';
import { TasklogsService } from 'src/app/Services/Task/Logs/tasklogs.service';
import {
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { User } from 'src/app/Models/User/user.model';
import { UserService } from 'src/app/Services/User/user.service';
import { TeamList } from 'src/app/Models/TeamHeirarchy/team-list';
import { TeamaccessService } from 'src/app/Services/TeamAccess/teamaccess.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.page.html',
  styleUrls: ['./view-task.page.scss'],
  standalone: true,
  imports: [
    IonSelectOption,
    IonSelect,
    IonList,
    IonItem,
    CommonModule,
    FormsModule,
    LucideAngularModule,
    HttpClientModule,
  ],
  providers: [TaskService, LoginService, TasklogsService, UserService, TeamaccessService],
})
export class ViewTaskPage implements OnInit {
  readonly Menu = Menu;
  readonly Circle = CircleUserRound;
  readonly Eye = Eye;
  readonly Trash = Trash;
  readonly Funnel = Funnel;
  dateToday = new Date().toISOString().split('T')[0];
  isFilterVisible: boolean = false;
  TaskList: Taskmodel[] = [];
  DuesList: TaskDueList[] = [];
  TaskCompleteList: TaskComplete[] = [];
  UserList: User[] = [];
  teamsList: TeamList[] = [];
  assigned: string = '';
  status: string = '';
  type: string = '';
  Category: string[] = ['To-Do List', 'Task'];
  types: string[] = ['PENDING', 'ON-GOING', 'COMPLETE'];
  User: any;
  Function: String = '';
  constructor(
    private TaskServices: TaskService,
    private routes: Router,
    private AuthServices: LoginService,
    private TaskLogsServices: TasklogsService,
    private UserServices: UserService,
    private TeamsServices: TeamaccessService
  ) {}

  ngOnInit() {
    this.displayuserLoggedIn();
    this.displayUsers();
  }
  displayUsers() {
    this.UserServices.displayuserList().subscribe((data) => {
      this.UserList = data;
    });
  }

  displayuserLoggedIn() {
    this.AuthServices.getUserFromAPI().subscribe((LoggedInData) => {
      this.User = LoggedInData;
      this.Function = this.User?.user_access.position.function;

      if (this.Function != 'Maker') {
        this.displayUserTask(this.User?.s_bpartner_employee_id,this.status,this.type);
        this.displayCompleteperUser();
        this.TeamsServices.teamDropDown(this.User?.s_bpartner_employee_id).subscribe((data) => {
          this.teamsList = data;
        });
      } else {
        this.displayUserTask(this.User?.s_bpartner_employee_id,this.status,this.type);
        this.displayCompleteperUser();
      }
    });
  }

  displayTask(status?: string, type?: string, assigned?: string) {
    this.TaskServices.displayTaskDues(status, type, assigned).subscribe(
      (data) => {
        this.DuesList = data;
      }
    );
  }

  displayUserTask(id: number, status?: string, type?: string) {
    this.TaskServices.displayUserTask(id, status, type).subscribe((data) => {
      this.DuesList = data;
    });
  }
  displayComplete() {
    this.TaskLogsServices.displayComplete().subscribe((data) => {
      this.TaskCompleteList = data;
    });
  }
  displayCompleteperUser() {
    this.TaskLogsServices.displayCompleteUser(
      this.User?.s_bpartner_employee_id
    ).subscribe((data) => {
      this.TaskCompleteList = data;
    });
  }

  applyFilters() {
    if (this.Function != 'Maker') {
      this.displayTask(this.status, this.type, this.assigned);
    } else {
      this.displayUserTask(
        this.User?.s_bpartner_employee_id,
        this.status,
        this.type
      );
    }
    this.isFilterVisible = false;
  }

  filterVisible() {
    if (this.isFilterVisible == false) {
      this.isFilterVisible = true;
    } else {
      this.isFilterVisible = false;
    }
  }
  viewinfo(task_i_information_id?: number) {
    if (task_i_information_id) {
      this.routes.navigate(['/taskinformation', task_i_information_id]);
    }
  }
  Remove(task_i_information_id?: number) {
    if (task_i_information_id) {
      this.TaskServices.removeTask(task_i_information_id).subscribe(()=>{
        this.displayTask(this.status, this.type, this.assigned);
        this.displayComplete();
      });
    }
  }
}
