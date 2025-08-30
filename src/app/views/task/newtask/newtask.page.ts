import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSelectOption,
  IonList,
  IonItem,
  IonSelect,
  IonDatetime,} from '@ionic/angular/standalone';
import { LucideAngularModule, Upload, Plus, ChevronLeft } from 'lucide-angular';
import { Taskmodel } from 'src/app/Models/Task/taskmodel';
import { TaskService } from 'src/app/Services/Task/task.service';
import { User } from 'src/app/Models/User/user.model';
import { UserService } from 'src/app/Services/User/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Tasksteps } from 'src/app/Models/TaskSteps/tasksteps.model';
import { Tasknotes } from 'src/app/Models/TaskNotes/tasknotes.model';
import { TasknoteService } from 'src/app/Services/TaskNote/tasknote.service';
import { TaskstepService } from 'src/app/Services/TaskStep/taskstep.service';
import { TaskdueService } from 'src/app/Services/Task/Due/taskdue.service';
import { TaskrepeatService } from 'src/app/Services/Task/Repeat/taskrepeat.service';
import { TaskremindService } from 'src/app/Services/Task/Remind/taskremind.service';
import { TaskDue } from 'src/app/Models/Task/Due/task-due.model';
import { TaskRepeat } from 'src/app/Models/Task/Repeat/task-repeat.model';
import { TaskRemind } from 'src/app/Models/Task/Remind/task-remind.model';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { FileService } from 'src/app/Services/Task/File/file.service';
import { Router } from '@angular/router';
import { ModalComponent } from "src/app/shared/modal/modal.component";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-newtask',
  templateUrl: './newtask.page.html',
  styleUrls: ['./newtask.page.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [IonList, IonItem, IonSelectOption,
    IonDatetime,
    CommonModule,
    FormsModule,
    IonSelect,
    LucideAngularModule,
    HttpClientModule, ModalComponent],
  providers: [
    TaskService,
    UserService,
    TaskstepService,
    TasknoteService,
    TaskdueService,
    TaskrepeatService,
    TaskremindService,
    LoginService,
    FileService
  ],
})
export class NewtaskPage implements OnInit {
  readonly Uploads = Upload;
  readonly Plus = Plus;
  readonly ChevronLeft = ChevronLeft;
  showDateSelection = false;
  dueDateSelected: string = '';
  DueDate: Date = new Date();
  DueDateSelector: string = new Date().toISOString();
  UserList: User[] = [];
  taskID: number = 0;
  LoginUser : number = 0;
  UserFunction : string = '';
  DueDateField: TaskDue = {
    task_i_information_id: 0,
    due_date: '',
    date_selected: '',
    created_by: 0,
  };
  DueRepeatField: TaskRepeat = {
    task_i_information_id: 0,
    repeat_frequency: '',
    created_by: 0,
  };
  DueRemindField: TaskRemind = {
    task_i_information_id: 0,
    remind_task: '',
    created_by: 0,
  };
  taskField: Taskmodel = {
    task_name: '',
    description: '',
    task_category: 'To-Do List',
    s_bpartner_employee_id: 0,
    created_by: 0,
    task_status: 'PENDING',
    employee_name: ''
  };
  StepsField: Tasksteps = {
    task_i_information_id: 0,
    task_steps_description: '',
    is_Active: true,
    created_by: 0,
  };
  NotesField: Tasknotes = {
    task_i_information_id: 0,
    task_note: '',
    is_Active: true,
    created_by: 0,
  };
  selectedFile: File | null = null;
  User : any;
  searchText: string = '';
  showDropdown: boolean = false;
  searchTerm: string = '';
  filteredUsers: any[] = [];

  taskFields = {
    s_bpartner_employee_id: '',
    employee_name: ''
  };
  nameSelected: string = '';

  listisVisible: boolean = false;
  listtitleHeader: string = 'Users List'

  resetFields() {
    this.taskField = {
      task_name: '',
      description: '',
      task_category: 'To-Do List',
      s_bpartner_employee_id: 0,
      created_by: this.LoginUser,
      task_status: 'PENDING',
      employee_name: ''
    };
    this.StepsField.task_steps_description = '';
    this.NotesField.task_note = '';
    this.DueDateField.due_date = '';
    this.DueRepeatField.repeat_frequency = '';
    this.DueRemindField.remind_task = '';
    this.dueDateSelected = '';
    this.searchText = '';
    this.nameSelected = '';
    this.selectedFile = null;
}

  constructor(
    private taskServices: TaskService,
    private UserServices: UserService,
    private TaskNoteServices: TasknoteService,
    private TaskStepsServices: TaskstepService,
    private TaskDueServices : TaskdueService,
    private TaskRepeatServices : TaskrepeatService,
    private TaskRemindServices : TaskremindService,
    private AuthServices : LoginService,
    private FileServices : FileService,
    private Routes : Router,
    private alertCtrl: AlertController
  ) {}
  ngOnInit() {
    this.displayUserDropDown();
    this.fetchUser();
    this.dateSelected();
    this.filteredUsers = this.UserList;
  }

  closeNoteModal(){
    this.listisVisible = false;
  }
  openList(){
    this.listisVisible = true;
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();

    this.filteredUsers = this.UserList.filter(user =>
      (user.firstname + ' ' + user.lastname).toLowerCase().includes(term)
    );
  }

  selectEmployee(user: any) {
    this.taskField.s_bpartner_employee_id = user.s_bpartner_employee_id;
    this.taskField.employee_name = `${user.firstname} ${user.lastname}`;
    this.searchText = this.taskField.employee_name;

    this.showDropdown = false;
  }
  getId(s_bpartner_employee_id: number) {
    const selectedUser = this.UserList.find(u => u.s_bpartner_employee_id === s_bpartner_employee_id);

    if (selectedUser) {
      this.nameSelected = `${selectedUser.firstname} ${selectedUser.lastname}`;
      this.taskField.s_bpartner_employee_id = selectedUser.s_bpartner_employee_id;
      this.listisVisible = false;
    }
  }
    
  fetchUser(){
    this.AuthServices.getUserFromAPI().subscribe((userData) => {
      this.User = userData;
      this.LoginUser = this.User?.s_bpartner_employee_id;
      this.UserFunction = this.User?.user_access.position.function;

      this.taskField.s_bpartner_employee_id = this.LoginUser;
      this.taskField.employee_name = `${this.User.firstname} ${this.User.lastname}`;
      this.searchText = this.taskField.employee_name;
      this.nameSelected = this.taskField.employee_name;

      
      if (this.UserFunction == "Maker") {
        this.taskField.s_bpartner_employee_id = this.LoginUser;
      }
    });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  dateSelected() {
    if (this.dueDateSelected === 'datePicker') {
      this.showDateSelection = true;
    } else {
      const dueDate = new Date();
      if (this.dueDateSelected === 'Today') {
      } else if (this.dueDateSelected === 'Tomorrow') {
        dueDate.setDate(dueDate.getDate() + 1);
      } else if (this.dueDateSelected === 'Next Week') {
        dueDate.setDate(dueDate.getDate() + 7);
      }
      this.DueDateSelector = dueDate.toISOString();
    }
  }

  close() {
    this.showDateSelection = false;
    console.log(this.DueDateField.due_date);
    
  }
  displayUserDropDown() {
    this.UserServices.displayuserList().subscribe((data) => {
      this.UserList = data;
    });
  }
  async showSuccessAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Task has been saved successfully!',
      buttons: [
        {
          text: 'Add Another',
          handler: () => {
            this.resetFields();
          }
        },
        {
          text: 'Back to Tasks',
          handler: () => {
            this.Routes.navigate(['/viewTask']);
          }
        }
      ]
    });
    await alert.present();
  }
  submitTask() {
    if (this.dueDateSelected === "datePicker") {
      const originalDate = new Date(this.DueDateField.due_date);
      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, '0');
      const day = String(originalDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      this.DueDateField.due_date = formattedDate;
    } else {
      const originalDate = new Date(this.DueDateSelector);
      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, '0');
      const day = String(originalDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      this.DueDateField.due_date = formattedDate;
    }

    if (this.LoginUser) {
      this.StepsField.created_by = this.LoginUser;
      this.taskField.created_by = this.LoginUser;
      this.NotesField.created_by = this.LoginUser;
      this.DueDateField.created_by = this.LoginUser;
      this.DueRepeatField.created_by = this.LoginUser;
      this.DueRemindField.created_by = this.LoginUser;

      this.taskServices.addNewTask(this.taskField).subscribe((taskContainID: any) => {
        this.taskID = taskContainID.task_i_information_id;
        this.StepsField.task_i_information_id = this.taskID;
        this.NotesField.task_i_information_id = this.taskID;
        this.DueDateField.task_i_information_id = this.taskID;
        this.DueRemindField.task_i_information_id = this.taskID;
        this.DueRepeatField.task_i_information_id = this.taskID;

        this.DueDateField.date_selected = this.dueDateSelected;
        if (this.NotesField.task_note && this.NotesField.task_note.trim() !== "") {
          this.TaskNoteServices.addNewNotes(this.NotesField).subscribe(() => {});
        }
        if (this.StepsField.task_steps_description && this.StepsField.task_steps_description.trim() !== "") {
          this.TaskStepsServices.addNewSteps(this.StepsField).subscribe(() => {});
        }
        this.TaskRemindServices.NewReminder(this.DueRemindField).subscribe(() => {});
        this.TaskRepeatServices.addRepeat(this.DueRepeatField).subscribe(() => {});
        this.TaskDueServices.newDueDate(this.DueDateField).subscribe(() => {});
        if (this.selectedFile) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            const payload = {
              task_i_information_id: this.taskID,
              task_file_name: this.selectedFile!.name,
              file: base64,
              created_by: this.LoginUser
            };
            this.FileServices.uploadTaskFile(payload).subscribe(() => {
              console.log('File uploaded successfully');
            });
          };
          reader.readAsDataURL(this.selectedFile);
        }

        this.showSuccessAlert();
      });
    }
  }
}
