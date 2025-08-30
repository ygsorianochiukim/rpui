import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from 'src/app/Services/Task/task.service';
import { HttpClientModule } from '@angular/common/http';
import { Taskmodel } from 'src/app/Models/Task/taskmodel';
import { LucideAngularModule, ChevronLeft , Download } from 'lucide-angular';
import { TaskstepService } from 'src/app/Services/TaskStep/taskstep.service';
import { Tasksteps } from 'src/app/Models/TaskSteps/tasksteps.model';
import { TasknoteService } from 'src/app/Services/TaskNote/tasknote.service';
import { Tasknotes } from 'src/app/Models/TaskNotes/tasknotes.model';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { TaskDue } from 'src/app/Models/Task/Due/task-due.model';
import { TaskdueService } from 'src/app/Services/Task/Due/taskdue.service';
import { TaskRemind } from 'src/app/Models/Task/Remind/task-remind.model';
import { TaskremindService } from 'src/app/Services/Task/Remind/taskremind.service';
import { TaskRepeat } from 'src/app/Models/Task/Repeat/task-repeat.model';
import { TaskrepeatService } from 'src/app/Services/Task/Repeat/taskrepeat.service';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { FileService } from 'src/app/Services/Task/File/file.service';
import { Taskfile } from 'src/app/Models/TaskFile/taskfile.model';
import { TasklogsService } from 'src/app/Services/Task/Logs/tasklogs.service';
import { Tasklogs } from 'src/app/Models/Task/Logs/tasklogs.model';

@Component({
  selector: 'app-taskinfo',
  templateUrl: './taskinfo.page.html',
  styleUrls: ['./taskinfo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LucideAngularModule,
    ModalComponent,
  ],
  providers: [
    TaskService,
    TaskstepService,
    TasknoteService,
    TaskdueService,
    TaskremindService,
    TaskrepeatService,
    LoginService,
    FileService,
    TasklogsService
  ],
})
export class TaskinfoPage implements OnInit {
  readonly Download = Download;
  constructor(
    private TaskServices: TaskService,
    private route: ActivatedRoute,
    private TaskStepServices: TaskstepService,
    private TaskNoteServices: TasknoteService,
    private TaskDueServices: TaskdueService,
    private TaskRemindServices: TaskremindService,
    private TaskRepeatServices: TaskrepeatService,
    private AuthServices : LoginService,
    private TaskFileServices : FileService,
    private TaskLogsServices : TasklogsService,
    private Routes : Router,
  ) {}
  CompleteButton: boolean = false;
  idParam: number = Number(this.route.snapshot.paramMap.get('task_i_information_id')) || 0;
  TaskInfo: Taskmodel | null = null;
  stepisVisible: boolean = false;
  steptitleHeader: string = 'Steps Description';
  noteisVisible: boolean = false;
  notetitleHeader: string = 'Notes Description';
  taskisVisible: boolean = false;
  tasktitleHeader: string = 'Task Files Description';
  TaskStepInfo: Tasksteps[] = [];
  TaskNoteInfo: Tasknotes[] = [];
  TaskDueDate: TaskDue[] = [];
  TaskRemind: TaskRemind[] = [];
  TaskRepeat: TaskRepeat[] = [];
  selectedFile: File | null = null;
  readonly ChevronLeft = ChevronLeft;
  StepField: Tasksteps = {
    task_i_information_id: this.idParam,
    task_steps_description: '',
    is_Active: true,
    created_by: 0,
  };
  NoteField: Tasknotes = {
    task_i_information_id: this.idParam,
    task_note: '',
    is_Active: true,
    created_by: 0,
  };
  FileFields: Taskfile ={
    task_i_information_id:  this.idParam,
    task_file_name: '',
    file: '',
    created_by: 0
  }
  TaskLogsFields: Tasklogs = {
    s_bpartner_employee_id: 0,
    task_i_information_id: this.idParam,
    created_by: 0,
  };
  taskFile : Taskfile[] = [];
  User : any;
  UserFunction : string = '';
  ngOnInit() {
    this.displayTaskInformation();
    this.fetchInformation();
  }
  fetchInformation(){
    this.AuthServices.getUserFromAPI().subscribe((LoggedInUser) => {
      this.User = LoggedInUser;
      this.UserFunction = this.User.user_access.position.function;
      this.TaskLogsFields.s_bpartner_employee_id = this.User.s_bpartner_employee_id;
      this.TaskLogsFields.created_by = this.User.s_bpartner_employee_id;
      this.TaskServices.displayTaskInfo(this.idParam).subscribe((data) => {
        this.TaskInfo = data;
        if (this.TaskInfo.s_bpartner_employee_id == this.User.s_bpartner_employee_id) {
          this.CompleteButton = true;
        }
      });
    });
  }
  markAsDone(){
    this.TaskLogsServices.addTaskLogs(this.TaskLogsFields).subscribe(() => {});
    if (!this.TaskRepeat.length || !this.TaskRepeat.some(item => item.repeat_frequency)) {
      this.TaskServices.updateNewTask(this.idParam).subscribe(() => {
      });
    } 
    else {
      this.TaskDueServices.updateTaskDue(this.idParam).subscribe(() => {});
    }
    this.Routes.navigate(['/viewTask']);
  }
  stepVisible() {
    this.stepisVisible = true;
  }
  
  closeStepModal() {
    this.stepisVisible = false;
  }
  noteVisible() {
    this.noteisVisible = true;
  }
  closeNoteModal() {
    this.noteisVisible = false;
  }
  taskVisible() {
    this.taskisVisible = true;
  }
  closetaskModal() {
    this.taskisVisible = false;
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  displayTaskInformation() {
    this.TaskStepServices.displayTaskStepInfo(this.idParam).subscribe(
      (data) => {
        this.TaskStepInfo = data;
      }
    );
    this.TaskNoteServices.displayTaskStepInfo(this.idParam).subscribe(
      (data) => {
        this.TaskNoteInfo = data;
      }
    );
    this.TaskDueServices.displayTaskDueInfo(this.idParam).subscribe(
      (data) => {
      this.TaskDueDate = data;
    });
    this.TaskRemindServices.displayTaskRemindInfo(this.idParam).subscribe(
      (data) => {
      this.TaskRemind = data;
    });
    this.TaskRepeatServices.displayTaskRepeatInfo(this.idParam).subscribe(
      (data) => {
      this.TaskRepeat = data;
    });
    this.TaskFileServices.displayUserTaskFile(this.idParam).subscribe(
      (data) => {
      this.taskFile = data;
    });
  }
  addNewStep() {
    this.StepField.created_by = this.User.s_bpartner_employee_id;
    this.TaskStepServices.addNewSteps(this.StepField).subscribe(() => {
      this.stepisVisible = false;
      this.StepField.task_steps_description = '';
      this.displayTaskInformation();
    });
  }
  addNewNote() {
    this.NoteField.created_by = this.User.s_bpartner_employee_id;
    this.TaskNoteServices.addNewNotes(this.NoteField).subscribe(() => {
      this.noteisVisible = false;
      this.NoteField.task_note = '';
      this.displayTaskInformation();
    });
  }
  addNewFile() {
    this.FileFields.created_by = this.User.s_bpartner_employee_id;
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const payload = {
          task_i_information_id: this.idParam,
          task_file_name: this.selectedFile!.name,
          file: base64,
          created_by:  this.User.s_bpartner_employee_id
        };
        this.TaskFileServices.uploadTaskFile(payload).subscribe(() => {
          this.displayTaskInformation();
          this.taskisVisible = false;
        });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  downloadFile(fileId: number) {
    this.TaskFileServices.downloadTaskFile(fileId).subscribe({
      next: (res) => {
        const link = document.createElement('a');
        link.href = res.file_data;
        link.download = res.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }
}
