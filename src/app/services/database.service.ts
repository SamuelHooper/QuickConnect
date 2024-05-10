import { Injectable, signal } from '@angular/core';
import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_COLLECTIONS = 'collectionsdb'

export interface Collection {
    id: number;
    title: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  collection: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private collection = signal<Collection[]>([]);

  constructor() { }

  async initalizeDB() {
    this.db = await this.sqlite.createConnection(
      DB_COLLECTIONS,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KET AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      collection INTEGER NOT NULL,
      FOREIGN KEY(collection) REFERENCES collections(id)
    );`;

    await this.db.execute(schema);
    this.loadCollections()
    return true;
  }

  async loadCollections() {
      const collections = await this.db.query('SELECT * FROM collections;');
      this.collection.set(collections.values || []);
  }
}
