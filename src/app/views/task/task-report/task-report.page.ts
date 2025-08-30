import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronLeft, FunnelIcon, ChevronDown } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { TaskService } from 'src/app/Services/Task/task.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { UserService } from 'src/app/Services/User/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface TeamMember {
  s_bpartner_employee_id: number;
  name: string;
  ACTIVE: number;
  DEADLINE: number;
  TEAM_PENDING: number;
  TEAM_ACTIVE: number;
  OWN_PENDING: number;
  OWN_ACTIVE: number;
  TEAM_PENDING_PERCENT: number;
  TEAM_ACTIVE_PERCENT: number;
  Team_Total_Pending: number;
  Team_Total_Active: number;
  chart: ChartData<'pie'>;
  members: TeamMember[];
}

interface User {
  s_bpartner_employee_id: number;
  firstname: string;
  lastname: string;
}

@Component({
  selector: 'app-task-report',
  templateUrl: './task-report.page.html',
  styleUrls: ['./task-report.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    NgChartsModule,
    HttpClientModule,
  ],
  providers: [TaskService, LoginService, UserService],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, maxHeight: '0px', overflow: 'hidden' }),
        animate('300ms ease-out', style({ opacity: 1, maxHeight: '500px' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, maxHeight: '500px', overflow: 'hidden' }),
        animate('300ms ease-in', style({ opacity: 0, maxHeight: '0px' }))
      ])
    ])
  ]
})
export class TaskReportPage implements OnInit {
  // Icons
  readonly ChevronLeft = ChevronLeft;
  readonly Funnel = FunnelIcon;
  readonly ChevronDown = ChevronDown;
  readonly Math = Math;

  // Component state
  isVisible: boolean = false;
  expandedTeams = new Set<number>();

  // Chart configuration
  chartType: ChartType = 'pie';
  chartLabels: string[] = ['PENDING', 'ACTIVE'];
  chartData: ChartData<'pie'> = {
    labels: this.chartLabels,
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#f87171', '#4ade80'],
        borderWidth: 0,
      },
    ],
  };
  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Data properties
  usersList: User[] = [];
  selectedUsers: number[] = [];
  usersProgress: TeamMember[] = [];
  UserLoggedIn: any;
  reportProgress : any;
  UserID: number = 0;

  constructor(
    private taskService: TaskService,
    private AuthServices: LoginService,
    private UserServices: UserService
  ) {}

  ngOnInit() {
    this.AuthServices.getUserFromAPI().subscribe((LoggedInData) => {
      this.UserLoggedIn = LoggedInData;
      this.UserID = LoggedInData.s_bpartner_employee_id;
      this.taskService.getTaskStatusCounts(this.UserID).subscribe(res => {
        const newData = [res.DEADLINE || 0, res.ACTIVE || 0];
        this.chartData.datasets[0].data = newData;
        localStorage.setItem('taskCounts', JSON.stringify(newData));
        this.chart?.update();
        this.reportProgress = res;
      });
      this.loadTeamProgress();
      this.loadUsers();
    });
  }
  loadTeamProgress() {
    this.taskService.getTeamProgress(this.UserID).subscribe((teamData) => {
      this.usersProgress = this.mapNodesToCharts(teamData);
    });
  }

  /**
   * Map API data to chart structure while preserving original data
   */
  mapNodesToCharts(nodes: any[]): TeamMember[] {
    return nodes.map(node => ({
      s_bpartner_employee_id: node.s_bpartner_employee_id,
      name: node.name,
      ACTIVE: node.ACTIVE || 0,
      DEADLINE: node.DEADLINE || 0,
      TEAM_ACTIVE: node.TEAM_ACTIVE || 0,
      TEAM_PENDING: node.TEAM_PENDING || 0,
      OWN_ACTIVE: node.OWN_ACTIVE || 0,
      OWN_PENDING: node.OWN_PENDING || 0,
      TEAM_PENDING_PERCENT: node.TEAM_PENDING_PERCENT || 0,
      TEAM_ACTIVE_PERCENT: node.TEAM_ACTIVE_PERCENT || 0,
      Team_Total_Pending: node.Team_Total_Pending || 0,
      Team_Total_Active: node.Team_Total_Active || 0,
      chart: {
        labels: ['PENDING', 'ACTIVE'],
        datasets: [
          {
            data: [node.DEADLINE || 0, node.ACTIVE || 0],
            backgroundColor: ['#f87171', '#4ade80'],
            borderWidth: 0,
          },
        ],
      },
      members: node.members ? this.mapNodesToCharts(node.members) : []
    }));
  }

  /**
   * Load users list for filtering
   */
  loadUsers() {
    this.UserServices.displayuserList().subscribe((users: any[]) => {
      this.usersList = users;
    });
  }

  /**
   * Handle user selection for filtering
   */
  onUserSelectChange(event: any, user: User) {
    if (event.target.checked) {
      this.selectedUsers.push(user.s_bpartner_employee_id);
    } else {
      this.selectedUsers = this.selectedUsers.filter(
        (id) => id !== user.s_bpartner_employee_id
      );
    }

    this.loadSelectedUsersProgress();
  }
  loadSelectedUsersProgress() {
    this.usersProgress = [];

    this.selectedUsers.forEach((userId) => {
      this.taskService.getTaskStatusCounts(userId).subscribe((res) => {
        const userInfo = this.usersList.find(
          (u) => u.s_bpartner_employee_id === userId
        );
        const userName = userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : 'Unknown User';

        this.usersProgress.push({
          s_bpartner_employee_id: userId,
          name: userName,
          ACTIVE: res.ACTIVE || 0,
          DEADLINE: res.DEADLINE || 0,
          TEAM_ACTIVE: res.TEAM_ACTIVE || 0,
          TEAM_PENDING: res.TEAM_PENDING || 0,
          OWN_ACTIVE: res.OWN_ACTIVE || 0,
          OWN_PENDING: res.OWN_PENDING || 0,
          TEAM_ACTIVE_PERCENT: res.TEAM_ACTIVE_PERCENT || 0,
          TEAM_PENDING_PERCENT: res.TEAM_PENDING_PERCENT || 0,
          Team_Total_Active: res.Team_Total_Active || 0,
          Team_Total_Pending: res.Team_Total_Pending || 0,
          chart: {
            labels: ['PENDING', 'ACTIVE'],
            datasets: [
              {
                data: [res.DEADLINE || 0, res.ACTIVE || 0],
                backgroundColor: ['#f87171', '#4ade80'],
                borderWidth: 0,
              },
            ],
          },
          members: []
        });
      });
    });
  }
  showFilter() {
    this.isVisible = !this.isVisible;
  }
  toggleTeam(index: number): void {
    if (this.expandedTeams.has(index)) {
      this.expandedTeams.delete(index);
    } else {
      this.expandedTeams.add(index);
    }
  }
  getOverallProgress(): number {
    const data = this.chartData.datasets[0].data as number[];
    
    const total = data.reduce((sum, value) => sum + value, 0);
    const active = data[1] || 0;
    return total > 0 ? Math.round((active / total) * 100) : 0;
  }
  getDisplayName(fullName: string): string {
    return fullName.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  isTeamLeader(user: TeamMember): boolean {
    return user.members && user.members.length > 0;
  }
  getTaskSummary(user: TeamMember): string {
    const active = Math.round(user.ACTIVE || 0);
    const deadline = Math.round(user.DEADLINE || 0);
    return `${active}% Active, ${deadline}% Pending`;
  }
  getProgressColor(activePercentage: number): string {
    if (activePercentage >= 80) return 'text-green-600';
    if (activePercentage >= 60) return 'text-blue-600';
    if (activePercentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }
  getMiniChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      elements: {
        arc: { borderWidth: 0 }
      }
    };
  }
}