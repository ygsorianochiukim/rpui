import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AppUpdate } from '@capawesome/capacitor-app-update';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private apiUrl = `${environment}/check-version`;
  private playStoreUrl = 'https://play.google.com/store/apps/details?id=com.renaissancepark.app';

  constructor(private http: HttpClient) { }

  async checkBackendVersion() {
    const info = await App.getInfo();
    const body = {
      platform: Capacitor.getPlatform(),
      version: info.version,
    };

    try {
      const res: any = await firstValueFrom(this.http.post(this.apiUrl, body));

      if (res.update_required) {
        alert('You must update the app to continue.');
        window.open(this.getStoreUrl(), '_system');
      } else if (res.update_available) {
        console.log('Optional update available:', res.latest_version);
      }
    } catch (err) {
      console.error('Version check failed:', err);
    }
  }
  async checkPlayStoreUpdate() {
    if (Capacitor.getPlatform() !== 'android') return;

    try {
      const result = await AppUpdate.getAppUpdateInfo();

      if (result.updateAvailability === 2) {
        if (result.immediateUpdateAllowed) {
          await AppUpdate.performImmediateUpdate();
        } else if (result.flexibleUpdateAllowed) {
          await AppUpdate.startFlexibleUpdate();
        }
      }
    } catch (err) {
      console.error('Play Core update failed:', err);
    }
  }
  private getStoreUrl(): string {
    if (Capacitor.getPlatform() === 'android') {
      return this.playStoreUrl ;
    }
    return this.playStoreUrl;
  }


}
