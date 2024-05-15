import { Component } from '@angular/core';
import { Collection, Item, DatabaseService } from '../services/database.service';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component'

@Component({
  selector: 'app-items',
  templateUrl: 'items.page.html',
  styleUrls: ['items.page.scss']
})
export class ItemsPage {
    currentCollection = this.database.currentCollection;
    items = this.database.getItems(this.currentCollection);
    
    constructor(private database: DatabaseService, private modalCtrl: ModalController) {}

    async addItem() {
        const modal = await this.modalCtrl.create({
          component: ModalComponent,
        });
        modal.present();
    
        const { data, role } = await modal.onWillDismiss();
    
        if (role === 'confirm') {
            await this.database.addItem(data, this.currentCollection.id);
        }
    }

    async editItem(item: Item) {
        const modal = await this.modalCtrl.create({
            component: ModalComponent,
            componentProps: {
                title: 'Edit Item',
                input: item.name
            }
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            if(data === '') {
                await this.database.updateItem(item.id, "empty", this.currentCollection.id);
            } else {
                await this.database.updateItem(item.id, data, this.currentCollection.id);
            }
        }
    }

    async editCollection(collection: Collection) {
        const modal = await this.modalCtrl.create({
            component: ModalComponent,
            componentProps: {
                title: 'Edit Collection',
                input: collection.title,
                inputLabel: "Collection title"
            }
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            if(data === '') {
                this.currentCollection.title = 'empty';
            } else {
                this.currentCollection.title = data;
            }
            await this.database.updateCollection(collection.id, this.currentCollection.title);
        }
    }

    async deleteItem(item: Item) {
        await this.database.deleteItem(item.id, this.currentCollection.id);
    }
}
