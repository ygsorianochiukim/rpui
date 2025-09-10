import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from 'src/app/Services/Task/task.service';
import { HttpClientModule } from '@angular/common/http';
import { Taskmodel } from 'src/app/Models/Task/taskmodel';
import { LucideAngularModule, ChevronLeft , Download , Trash , Pencil } from 'lucide-angular';
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
import { IonSelectOption,
  IonList,
  IonItem,
  IonSelect,
  IonDatetime,} from '@ionic/angular/standalone';
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
    IonItem,IonList,IonDatetime,IonSelect,IonSelectOption
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
    TasklogsService,
  ],
})
export class TaskinfoPage implements OnInit {
  readonly Download = Download;
  readonly Trash = Trash;
  readonly Pencil = Pencil;
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
  dueDateID : number = 0;
  repeatDateID : number = 0;
  showDateSelection = false;
  dueDateSelected: string = '';
  CompleteButton: boolean = false;
  idParam: number = Number(this.route.snapshot.paramMap.get('task_i_information_id')) || 0;
  TaskInfo: Taskmodel | null = null;
  stepisVisible: boolean = false;
  steptitleHeader: string = 'Steps Description';
  noteisVisible: boolean = false;
  repeattitleHeader: string = 'Repeat Information';
  repeatisVisible: boolean = false;
  notetitleHeader: string = 'Notes Description';
  taskisVisible: boolean = false;
  tasktitleHeader: string = 'Task Files Description';
  dueisVisible: boolean = false;
  duetitleHeader: string = 'Update Due Date';
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
  DueDateField: TaskDue = {
    task_i_information_id: 0,
    due_date: '',
    date_selected: '',
    created_by: 0,
  };
  DueRepeatField: TaskRepeat = {
    task_i_information_id: 0,
    repeat_frequency: '',
    created_by: 0
  }
  taskFile : Taskfile[] = [];
  User : any;
  UserFunction : string = '';
  DueDateSelector: string = new Date().toISOString();
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
      this.DueDateField.created_by = this.User.s_bpartner_employee_id;
      this.DueRepeatField.created_by = this.User.s_bpartner_employee_id;
      this.TaskServices.displayTaskInfo(this.idParam).subscribe((data) => {
        this.TaskInfo = data;
        if (this.TaskInfo.s_bpartner_employee_id == this.User.s_bpartner_employee_id) {
          this.CompleteButton = true;
        }
      });
    });
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
  submitDueDate(){
    if (this.dueDateID) {
      this.DueDateField.due_date = this.DueDateField.due_date;
      this.TaskDueServices.updateSelectedDue(this.dueDateID, this.DueDateField.due_date).subscribe(() =>{
        this.dueisVisible = false;
        this.displayTaskInformation();
        this.showDateSelection=false;
      });
    }
    else{
      this.showDateSelection=false;
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
      this.DueDateField.task_i_information_id = this.idParam;
      this.DueDateField.date_selected = this.dueDateSelected;
      this.TaskDueServices.newDueDate(this.DueDateField).subscribe(() =>{
        this.dueisVisible = false;
        this.displayTaskInformation();
        this.showDateSelection=false;
      });
    }
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
  close() {
    this.showDateSelection = false;
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
  repeatVisible(){
    this.repeatisVisible = true;
  }
  closerepeatModal(){
    this.repeatisVisible = false;
  }
  editDueDate(task_due_date_id: number){
    if (task_due_date_id) {
      this.dueDateID = task_due_date_id;
      this.dueisVisible = true;
    }
  }
  editRepeatDate(task_repeat_id: number){
    if (task_repeat_id) {
      this.repeatDateID = task_repeat_id;
      this.repeatisVisible = true;
    }
  }
  dueDateVisible(){
    this.showDateSelection = false
    this.dueisVisible = true;
    console.log(this.showDateSelection);
    
  }
  closetaskdueModal() {
    this.dueisVisible = false;
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
  addNewRepeat(){
    if (this.repeatDateID) {
      this.TaskRepeatServices.updateSelectedRepeatFrequency(this.repeatDateID, this.DueRepeatField.repeat_frequency)
      .subscribe(()=> {
        this.repeatisVisible = false;
        this.displayTaskInformation();
      });
    }
    else{
      this.DueRepeatField.task_i_information_id = this.idParam;
      this.TaskRepeatServices.addRepeat(this.DueRepeatField).subscribe(() => {
        this.displayTaskInformation();
        this.repeatisVisible = false;
      })
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
