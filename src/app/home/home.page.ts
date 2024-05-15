import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Collection, DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
    @ViewChild(IonModal) modal: IonModal;

    collections;
    newCollectionName = '';
    constructor(private router: Router, private database: DatabaseService) {
        this.collections = this.database.getCollections();
    }

    viewCollection(collection: Collection) {
        this.database.currentCollection = collection;
        this.router.navigate(['/items']);
    }

    cancel() {
        this.newCollectionName = '';
        this.modal.dismiss(null, 'cancel');
    }
    
    confirm() {
        this.createCollection();
        this.modal.dismiss(this.newCollectionName, 'confirm');
    }

    async createCollection() {
        if(this.newCollectionName === '') {
            this.newCollectionName = 'empty';
        }
        await this.database.addCollection(this.newCollectionName);
        this.newCollectionName = '';
    }

    async deleteCollection(collection: Collection) {
        await this.database.deleteCollection(collection.id)
    }
}
