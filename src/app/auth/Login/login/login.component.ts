import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { CommonModule, Time } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UserLock, Lock , CircleX } from 'lucide-angular';
import { IonText } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { LoginService } from 'src/app/Services/Auth/login.service';
import { Storage } from '@ionic/storage-angular';
import { UserService } from 'src/app/Services/User/user.service';
import { User } from 'src/app/Models/User/user.model';
import { timestamp } from 'rxjs';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonText,
    LucideAngularModule,
  ],
  providers: [
    LoginService,
    UserService
  ]
})
export class LoginComponent implements OnInit {
  readonly User = UserLock;
  readonly Lock = Lock;
  readonly Close = CircleX;

  emailOrUsername = '';
  password = '';
  errorMessage = '';
  loading = false;
  isListVisible: boolean = false;
  searchTerm: string = '';
  currentTime: Date = new Date();
  private timer: any;
  filteredUsers: any[] = [];
  constructor(
    private storage: Storage,
    private router: Router,
    private authService: LoginService,
    private UserServices: UserService,
    private oneSignal: OneSignal,
    private http: HttpClient
  ) {}
  UserList : User[] = [];
  async ngOnInit() {
    await this.storage.create();
    const user = await this.storage.get('User');
    const token = await this.storage.get('token');

    if (user && token) {
      // Check if token is still valid by calling backend
      this.authService.getUserFromAPI().subscribe({
        next: () => {
          this.router.navigate(['/home']); // valid token → go home
        },
        error: async (err) => {
          if (err.status === 401) {
            // Token expired/invalid → clear storage + redirect
            await this.storage.clear();
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.displayUsersList();
    }

    this.filteredUsers = this.UserList;

    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }


  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  get canShowCreateAccount(): boolean {
    const hours = this.currentTime.getHours();
    const minutes = this.currentTime.getMinutes();
    if ((hours > 17) || (hours === 17 && minutes >= 30) || (hours < 8 && minutes >= 30)) {
      return false;
    }
    return true;
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.UserList.filter(user =>
      (user.firstname + ' ' + user.lastname).toLowerCase().includes(term)
    );
  }
  login() {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.emailOrUsername, this.password).subscribe({
      next: async (res) => {
        this.loading = false;
        await this.storage.set('session', res);
        this.oneSignal.getIds().then(ids => {
          console.log('Player ID:', ids.userId);

          this.http.post(`${environment.apiUrl}/save-player-id`, {
            user_id: res.user.s_bpartner_employee_id,
            player_id: ids.userId
          }).subscribe(saveRes => {
            console.log('Player ID saved to backend:', saveRes);
          });
        });
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }
  displayUsersList(){
    this.UserServices.displayuserList().subscribe((data) => {
      this.UserList = data;
    });
  }

  showUserList(){
    this.isListVisible = true;
  }
  closeList(){
    this.isListVisible = false;
  }
  requestAccount(s_bpartner_employee_id?: number){
    if (s_bpartner_employee_id) {
      this.router.navigate(['/generateAccount', s_bpartner_employee_id]);
      this.isListVisible = false;
    }
  }
}
