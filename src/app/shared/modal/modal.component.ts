import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports:[CommonModule],
  styleUrls: ['./modal.component.scss'],
  standalone: true,
})
export class ModalComponent  implements OnInit {
  @Input() titleHeader: string = 'Sample Header';
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {}

  close() {
    this.closeModal.emit();
  }

}
