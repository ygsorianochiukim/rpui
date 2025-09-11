import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonList,
  IonItem,
  IonSelectOption,
  IonDatetime,
  IonButton,
  AlertController,
} from '@ionic/angular/standalone';
import { TaskPositionService } from 'src/app/Services/Task/DefaultTask/task-position.service';
import { TaskDue } from 'src/app/Models/Task/Due/task-due.model';
import { TaskService } from 'src/app/Services/Task/task.service';
import { Taskmodel } from 'src/app/Models/Task/taskmodel';
import { Positiontask } from 'src/app/Models/Task/PositionTask/positiontask';
import { PositionService } from 'src/app/Services/Position/position.service';
import { Position } from 'src/app/Models/Position/position';
import { Router } from '@angular/router';
import { TaskRepeat } from 'src/app/Models/Task/Repeat/task-repeat.model';
import { Tasksteps } from 'src/app/Models/TaskSteps/tasksteps.model';
import { Tasknotes } from 'src/app/Models/TaskNotes/tasknotes.model';
import { FileService } from 'src/app/Services/Task/File/file.service';
import { LucideAngularModule, Pencil, RefreshCcw } from 'lucide-angular';
import { LoginService } from 'src/app/Services/Auth/login.service';

@Component({
  selector: 'app-taskposition',
  templateUrl: './taskposition.page.html',
  styleUrls: ['./taskposition.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
    IonDatetime,
    LucideAngularModule
  ],
  providers: [TaskPositionService, TaskService, PositionService, LoginService],
})
export class TaskpositionPage implements OnInit {
  readonly Pencil = Pencil;
  readonly Sync = RefreshCcw;
  position: any;
  rows: any;
  headers: any;
  taskFieldVisible: boolean = false;
  dueDateSelected: string = '';
  DueDateSelector: string = new Date().toISOString();
  showDateSelection = false;
  isUpdating: boolean = false;
  isAdding: boolean = false;
  LoginUserID : number = 0;
  searchQuery: string = '';
  User: any;
  currentTaskId: number | null = null;
  TaskField: Positiontask = {
    task_name: '',
    description: '',
    task_category: 'Task',
    created_by: this.LoginUserID,
    position_id: 0,
    date_selected: '',
    due_date: '',
    task_notes: '',
    task_step: '',
    file: '',
    repeat_frequency: '',
    remind_task: '',
  };
  TaskpositionList: Positiontask[] = [];
  selectedFile: File | null = null;
  displayPositionList: Position[] = [];
  taskID: number = 0;
  
  constructor(
    private TaskDefaultServices: TaskPositionService,
    private TaskServices: TaskService,
    private TaskPositionServices: TaskPositionService,
    private PositionServives: PositionService,
    private alertController: AlertController,
    private Routes : Router,
    private AuthServices : LoginService,
  ) {}

  ngOnInit() {
    this.displayPosition();
    this.dateSelected();
    this.displayTaskBank();
    console.log(this.currentTaskId);
    this.fetchData();
  }

  fetchData(){
    this.AuthServices.getUserFromAPI().subscribe(userData => {
      this.User = userData;
      this.LoginUserID = this.User?.s_bpartner_employee_id;
    });
  }

  dateSelected() {
    const dueDate = new Date();
    if (this.dueDateSelected === 'datePicker') {
      this.showDateSelection = true;
      return;
    }
    if (this.dueDateSelected === 'Today') {
    } else if (this.dueDateSelected === 'Tomorrow') {
      dueDate.setDate(dueDate.getDate() + 1);
    } else if (this.dueDateSelected === 'Next Week') {
      dueDate.setDate(dueDate.getDate() + 7);
    }

    this.DueDateSelector = dueDate.toISOString();
    this.TaskField.due_date = this.DueDateSelector;
    this.TaskField.date_selected = this.dueDateSelected;
    this.showDateSelection = false;
  }
  editTask(task: any) {
    this.isAdding = true;
    this.taskFieldVisible = true;
    this.isUpdating = true;
    this.currentTaskId = task.task_bank_id;
    console.log(this.isUpdating);
    console.log(this.currentTaskId);
    this.TaskField = {
      position_id: task.position_id,
      task_name: task.task_name,
      description: task.description,
      task_step: task.task_step,
      task_notes: task.task_notes,
      repeat_frequency: task.repeat_frequency,
      remind_task: task.remind_task,
      task_category: 'Task',
      created_by: this.LoginUserID,
    };
    this.DueDateSelector = task.due_date || '';
  }
  async sync(row: any) {
    this.TaskPositionServices.syncSingleTask(row.task_bank_id, row.position_id, this.LoginUserID)
      .subscribe({
        next: async (res) => {
          console.log("Single Task Synced", res);

          const alert = await this.alertController.create({
            header: 'Success',
            message: 'Task synced successfully!',
            buttons: ['OK']
          });
          await alert.present();
        },
        error: async (err) => {
          console.error("Sync failed", err);

          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Failed to sync task. Please try again.',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
  }
  close() {
    this.showDateSelection = false;
    this.TaskField.due_date = this.DueDateSelector;
    this.TaskField.date_selected = 'Pick a Date';
  }

  displayPosition() {
    this.PositionServives.displayPosition().subscribe((data) => {
      this.displayPositionList = data;
    });
  }
  addTaskPosition() {
    if (this.isUpdating && this.currentTaskId) {
      this.updateTask();
    } else {
      this.createTask();
    }
  }
  async createTask() {
    const alert = await this.alertController.create({
      header: 'Task added complete!',
      message: 'Do you want to save this new Task?',
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
            this.newTaskPerPosition();
            this.displayTaskBank();
          },
        },
      ],
    });
    await alert.present();
  }
  updateTask() {
    if (!this.currentTaskId) return;

    this.TaskPositionServices.taskUpdate(this.currentTaskId, this.TaskField)
      .subscribe(() => {
        console.log("Task updated and synced");
        this.isUpdating = false;
        this.currentTaskId = null;
        this.resetForm();
      });
  }
  newTaskBank(){
    
    if (this.isAdding == false) {
      this.isAdding = true;
      this.taskFieldVisible = true;
    }
    else{
      this.isAdding = false;
      this.taskFieldVisible = false;
    }
  }
  displayTaskBank(){
    this.TaskPositionServices.getAll().subscribe((data) => {
      this.TaskpositionList = data;
    });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  newTaskPerPosition() {
    this.TaskField.date_selected = this.dueDateSelected;

    if (this.dueDateSelected !== 'datePicker') {
      this.TaskField.due_date = this.DueDateSelector;
    }

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.TaskField.file = base64;
        this.TaskField.created_by = this.LoginUserID;
        this.TaskPositionServices.create(this.TaskField).subscribe(
          (res: any) => {
            console.log('Task with file uploaded successfully', res);
            this.showSuccessAlert();
            this.resetForm();
          },
          (error) => {
            console.error('Error uploading task with file', error);
          }
        );
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.TaskPositionServices.create(this.TaskField).subscribe(
        (res: any) => {
          console.log('Task created successfully', res);
          this.showSuccessAlert();
          this.resetForm();
        },
        (error) => {
          console.error('Error creating task', error);
        }
      );
    }
  }
  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Task has been saved successfully!',
      buttons: [
        {
          text: 'Add Another',
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
  async syncTask() {
    const alert = await this.alertController.create({
      header: 'Task added complete!',
      message: 'Do you want to sync this Task?',
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
            this.TaskListSync();
            this.displayTaskBank();
          },
        },
      ],
    });
    await alert.present();
  }


  TaskListSync(){
    if (!this.TaskField.position_id) {
      console.error('No position selected for sync');
      return;
    }

    const userId = this.TaskField.created_by;

    if(userId){
      this.TaskPositionServices.syncByPosition(this.TaskField.position_id, userId).subscribe({
        next: (res) => {
          console.log('Sync success', res);
          this.resetForm();
          this.displayPosition();
        },
        error: (err) => {
          console.error('Sync failed', err);
        }
      });
    }
  }
  get filteredTaskList(): Positiontask[] {
    if (!this.searchQuery) return this.TaskpositionList;

    const lowerQuery = this.searchQuery.toLowerCase();
    return this.TaskpositionList.filter(task =>
      task.task_name?.toLowerCase().includes(lowerQuery) ||
      task.position?.position?.toLowerCase().includes(lowerQuery)
    );
  }
  resetForm() {
    this.TaskField = {
      task_name: '',
      description: '',
      task_category: 'Task',
      created_by: this.LoginUserID,
      position_id: 0,
      date_selected: '',
      due_date: '',
      task_notes: '',
      task_step: '',
      file: '',
      repeat_frequency: '',
      remind_task: '',
    };

    this.dueDateSelected = '';
    this.DueDateSelector = new Date().toISOString();
    this.showDateSelection = false;
    this.isUpdating = false;
    this.isAdding = false;
    this.taskFieldVisible = false;
    this.currentTaskId = null;
    this.selectedFile = null;
  }
}
