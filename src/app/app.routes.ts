import { Routes } from '@angular/router';
import { LayoutPage } from './Layout/layout/layout.page';
import { HomePage } from './home/home.page';
import { TaskPage } from './views/task/task.page';
import { UserAccountComponent } from './views/HR/user-account/user-account.component';
import { UserAccessComponent } from './views/HR/user-access/user-access.component';
import { PositionPage } from './views/HR/position/position.page';
import { TaskinfoPage } from './views/task/TaskInformation/taskinfo/taskinfo.page';
import { NewtaskPage } from './views/task/newtask/newtask.page';
import { ViewTaskPage } from './views/view-task/view-task.page';
import { TaskReportPage } from './views/task/task-report/task-report.page';
import { LoginComponent } from './auth/Login/login/login.component';
import { DashboardPage } from './views/dashboard/dashboard.page';
import { ViewUsersComponent } from './views/HR/view-users/view-users.component';
import { ProfilePage } from './views/Profile/profile/profile.page';
import { AccountconfigComponent } from './auth/GenerateAccount/accountconfig/accountconfig.component';
import { MyteamPage } from './views/HR/myteam/myteam.page';
import { AnnouncementPage } from './views/announcement/announcement.page';
import { UserinformationPage } from './views/HR/user-information/userinformation.page';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutPage,
    children: [
      { path: 'home', component: DashboardPage },
      { path: 'viewEmployee', component: ViewUsersComponent },
      { path: 'profileView', component: ProfilePage },
      { path: 'AddEmployee', component: UserAccountComponent },
      { path: 'myteam', component: MyteamPage },
      { path: 'accountAccess', component: UserAccessComponent },
      { path: 'task', component: TaskPage },
      { path: 'viewTask', component: ViewTaskPage },
      { path: 'position', component: PositionPage },
      { path: 'taskinformation/:task_i_information_id', component: TaskinfoPage },
      { path: 'newTask', component: NewtaskPage },
      { path: 'taskReport', component: TaskReportPage },
      { path: 'userinformation/:s_bpartner_employee_id', component: UserinformationPage },
      { path: 'announcements', component: AnnouncementPage }
    ]
  },
  {
    path: 'generateAccount/:s_bpartner_employee_id',
    component: AccountconfigComponent
  },
  { path: '**', redirectTo: 'login' },
];
