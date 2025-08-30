import { Component, Input, OnInit } from '@angular/core';
import { LucideAngularModule , Menu } from "lucide-angular";

@Component({
  selector: 'app-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.scss'],
  imports: [LucideAngularModule],
})
export class HamburgerComponent  implements OnInit {

  readonly Menu = Menu;
  @Input() isOpen : boolean = false;

  constructor() { }

  ngOnInit() {}

}
