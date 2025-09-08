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
  ],
  providers: [TaskPositionService, TaskService, PositionService],
})
export class TaskpositionPage implements OnInit {
  position: any;
  rows: any;
  headers: any;

  dueDateSelected: string = '';
  DueDateSelector: string = new Date().toISOString();
  showDateSelection = false;

  TaskField: Positiontask = {
    task_name: '',
    description: '',
    task_category: 'Task',
    created_by: 3723,
    position_id: 0,
    date_selected: '',
    due_date: '',
  };

  TaskpositionList: Positiontask[] = [];

  DueDateField: TaskDue = {
    task_i_information_id: 0,
    due_date: '',
    date_selected: '',
    created_by: 0,
  };

  displayPositionList: Position[] = [];

  constructor(
    private TaskDefaultServices: TaskPositionService,
    private TaskServices: TaskService,
    private TaskPositionServices: TaskPositionService,
    private PositionServives: PositionService,
    private alertController: AlertController,
    private Routes : Router
  ) {}

  ngOnInit() {
    this.displayPosition();
    this.dateSelected();
    this.displayTaskBank();
  }

  dateSelected() {
    const dueDate = new Date();

    if (this.dueDateSelected === 'datePicker') {
      this.showDateSelection = true;
      return;
    }

    if (this.dueDateSelected === 'Today') {
      // keep today
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
  async addTaskPosition() {
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
  displayTaskBank(){
    this.TaskPositionServices.getAll().subscribe((data) => {
      this.TaskpositionList = data;
    });
  }
  newTaskPerPosition(){
    this.TaskField.date_selected = this.dueDateSelected;
    if (this.dueDateSelected !== 'datePicker') {
      this.TaskField.due_date = this.DueDateSelector;
    }

    this.TaskPositionServices.create(this.TaskField).subscribe({
      next: (res) => console.log('Task saved', res),
      error: (err) => console.error('Error saving task', err),
    });
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

          this.displayPosition();
        },
        error: (err) => {
          console.error('Sync failed', err);
        }
      });
    }
  }
}
