import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { VerseService } from './Services/Verse/verse.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { environment } from 'src/environments/environment.prod';
import { AppUpdate } from '@capawesome/capacitor-app-update';
import { App } from '@capacitor/app';
import { UpdateService } from './Services/Update/update.service';
import { CleanTitlecasePipe } from './clean-titlecase.pipe';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, CleanTitlecasePipe],
  providers: [OneSignal, UpdateService]
})
export class AppComponent implements OnInit {
  constructor( private verseServices : VerseService,
    private platform: Platform,
    private oneSignal: OneSignal,
    private http: HttpClient,
    private UpdateServices : UpdateService
  ) {
    this.initializeApp();
  }
  
  async ngOnInit(){
    await LocalNotifications.requestPermissions();
    await LocalNotifications.cancel({ notifications: [{ id: 777 }] });
    const verse = this.verseServices.getLocalVerseFor();
    await LocalNotifications.schedule({
      notifications: [{
        id: 777,
        title: 'Verse of the Day',
        body: `${verse.ref} — ${verse.text}`,
        schedule: { repeats: true, every: 'day', at: this.atHour(7) },
        smallIcon: 'ic_stat_notification',
      }]
    });
    await this.UpdateServices.checkBackendVersion();
    await this.UpdateServices.checkPlayStoreUpdate();
  }

  private atHour(h: number) {
    const d = new Date();
    d.setHours(h, 0, 0, 0);
    if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
    return d;
  }

  async initializeApp() {
    await StatusBar.hide();
    await StatusBar.setOverlaysWebView({ overlay: true });
    this.platform.ready().then(() => {
      // this.setupPush();
    });
  }
  // setupPush() {
  //   this.oneSignal.startInit('d7ae02c3-63b5-4824-95d9-50085c3c938e', '800804574318');

  //   this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

  //   this.oneSignal.handleNotificationReceived().subscribe(() => {
  //     console.log('Notification received');
  //   });

  //   this.oneSignal.handleNotificationOpened().subscribe(() => {
  //     console.log('Notification opened');
  //   });

  //   this.oneSignal.getIds().then(ids => {
  //     console.log('Player ID:', ids.userId);
  //     this.http.post(`${environment.apiUrl}/save-player-id`, {
  //       user_id: 3723,
  //       player_id: ids.userId
  //     }).subscribe(res => {
  //       console.log('Saved to Laravel:', res);
  //     });
  //   });

  //   this.oneSignal.endInit();
  // }
}
