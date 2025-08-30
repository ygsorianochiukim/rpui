import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Taskmodel } from 'src/app/Models/Task/taskmodel';
import { User } from 'src/app/Models/User/user.model';
import { UserService } from 'src/app/Services/User/user.service';
import { TaskService } from 'src/app/Services/Task/task.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule , Menu } from 'lucide-angular';
@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LucideAngularModule
  ],
  providers: [UserService, TaskService],
})
export class TaskPage implements OnInit {
  readonly Menu = Menu;
  TaskModal: string = 'Task Information';
  isVisible: boolean = false;
  taskList: Taskmodel[] = [];
  
  constructor(
    private taskServices: TaskService,
    private routes: Router
  ) {}

  ngOnInit() {
    this.displayTaskList();
  }
  openModal() {
    this.isVisible = true;
  }
  closeModal() {
    this.isVisible = false;
  }

  displayTaskList() {
    this.taskServices.displayTask().subscribe((data) => {
      this.taskList = data;
    });
  }
  addNewTask(){
    this.routes.navigate(['/newTask']);
  }

  viewinfo(task_i_information_id?: string){
    if (task_i_information_id) {
      this.routes.navigate(['/taskinformation', task_i_information_id]);
    }
  }
}
