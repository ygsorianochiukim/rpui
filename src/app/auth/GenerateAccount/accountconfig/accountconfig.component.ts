import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, Routes } from '@angular/router';
import { IonText, IonAlert } from '@ionic/angular/standalone';
import { LucideAngularModule, Upload, MousePointer2, ArrowLeft } from 'lucide-angular';
import { User } from 'src/app/Models/User/user.model';
import { LoginService } from 'src/app/Services/Auth/login.service';
import { UserService } from 'src/app/Services/User/user.service';

@Component({
  selector: 'app-accountconfig',
  templateUrl: './accountconfig.component.html',
  styleUrls: ['./accountconfig.component.scss'],
  imports: [
    LucideAngularModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
  ],
  providers: [UserService, LoginService],
})
export class AccountconfigComponent implements OnInit {
  readonly Upload = Upload;
  readonly Mouse = MousePointer2;
  readonly left = ArrowLeft;
  constructor(
    private AccountServices: UserService,
    private route: ActivatedRoute,
    private AuthServices: LoginService,
    private routes : Router
  ) {}
  UserList: User[] = [];

  UserPassword = { password: '' };

  idParam: number =
    Number(this.route.snapshot.paramMap.get('s_bpartner_employee_id')) || 0;
  User: User | null = null;
  verifyContact: string | null = null;
  originalContactNumber: string = '';
  maskedContactNumber: string = '';
  verifyOtp: string | undefined = undefined;
  otpValue: string = '';
  mismatchotp: boolean = false;
  isButtonDisabled: boolean = false;
  remainingTime: number = 0;
  timerInterval: any;
  ngOnInit() {
    this.displayUsersList();
  }

  displayUsersList() {
    this.AccountServices.userinformation(this.idParam).subscribe((data) => {
      this.User = data;

      if (this.User.contact_no) {
        this.originalContactNumber = this.User.contact_no.toString();
        this.maskedContactNumber = this.originalContactNumber.replace(
          /^(\d{7})/,
          '*******'
        );
        this.verifyOtp = this.User.OTP?.toString();
      }
    });
  }

  verify() {

    this.isButtonDisabled = true;
    this.remainingTime = 15 * 60;

    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.isButtonDisabled = false;
        clearInterval(this.timerInterval);
      }
    }, 1000);
    this.AccountServices.sentOTP(this.idParam).subscribe({
      next: (res) => {
        this.displayUsersList();
      },
    });
  }

  checkMismatch() {
    if (this.otpValue.length == this.verifyOtp?.length) {
      if (this.otpValue != this.verifyOtp) {
        this.mismatchotp = true;
      }
    } else {
      this.mismatchotp = false;
    }
  }
  removeLeadingZero(value: string) {
    this.verifyContact = value.replace(/^0+/, "");
    if (this.verifyContact.length > 10) {
      this.verifyContact = this.verifyContact.substring(0, 10);
    }
  }

  validateNumberInput(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
      return;
    }

    const input = event.target as HTMLInputElement;
    if (input.selectionStart === 0 && char === "0") {
      event.preventDefault();
    }
    if (input.value.length >= 10) {
      event.preventDefault();
    }
  }
  preventLeadingZero(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.selectionStart === 0 && event.key === "0") {
      event.preventDefault();
    }
  }

  back(){
    this.routes.navigate(['/']);
  }

  createPassword() {
    if (!this.User?.s_bpartner_employee_id || !this.UserPassword.password) {
      console.error('Missing user ID or password');
      return;
    }
    this.AuthServices.changePassword(
      this.User.s_bpartner_employee_id,
      this.UserPassword.password
    ).subscribe(() => {
      this.routes.navigate(['/']);
    });
  }
}
