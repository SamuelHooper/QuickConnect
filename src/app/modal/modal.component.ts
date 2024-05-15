import { Component } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
})
export class ModalComponent {
  title: string;
  inputLabel: string;
  input: string;

  constructor(private modalCtrl: ModalController) {
    this.title = "Add new Item";
    this.inputLabel = "Item name";
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.input, 'confirm');
  }
}