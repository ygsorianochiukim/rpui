import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './app/Services/Auth/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicStorageModule.forRoot(),HttpClientModule),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
