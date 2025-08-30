import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavigationPage } from 'src/app/shared/navigation/navigation.page';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule ,NavigationPage, RouterOutlet]
})
export class LayoutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
