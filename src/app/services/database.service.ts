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
  collection: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private collections = signal<Collection[]>([]);
  private items = signal<Item[]>([]);
  public currentCollection: Collection;

  constructor() { }

  getCollections() {
    this.loadCollections();
    return this.collections;
  }

  getItems(collection: Collection) {
    this.loadItems(collection.id);
    return this.items;
  }

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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      collection INTEGER NOT NULL,
      FOREIGN KEY(collection) REFERENCES collections(id)
    );`;

    await this.db.execute(schema);
    return true;
  }

  // Collections
  async loadCollections() {
      const collections = await this.db.query('SELECT * FROM collections ORDER BY title ASC;');
      this.collections.set(collections.values || []);
  }

  async addCollection(title: string) {
    const query = `INSERT INTO collections (title) VALUES ('${title}')`;
    const result = await this.db.query(query);
    this.loadCollections();
    return result;
  }

  async updateCollection(id: number, title: string) {
    const query = `UPDATE collections SET title='${title}' WHERE id=${id}`;
    const result = await this.db.query(query);
    this.loadCollections();
    return result;
  }

  async deleteCollection(id: number) {
    const firstQuery = `DELETE FROM items WHERE collection=${id}`;
    await this.db.query(firstQuery);
    const secondQuery = `DELETE FROM collections WHERE id=${id}`;
    const result = await this.db.query(secondQuery);
    this.loadCollections();
    return result;
  }

  // Items
  async loadItems(id: number) {
    const items = await this.db.query(`SELECT * FROM items WHERE collection=${id} ORDER BY name ASC`);
    this.items.set(items.values || []);
  }

  async addItem(name: string, collection:  number) {
    const query = `INSERT INTO items (name, collection) VALUES ('${name}', '${collection}')`;
    const result = await this.db.query(query);
    this.loadItems(collection);
    return result;
  }

  async updateItem(id: number, name: string, collection:  number) {
    const query = `UPDATE items SET name='${name}' WHERE id=${id}`;
    const result = await this.db.query(query);
    this.loadItems(collection);
    return result;
  }

  async deleteItem(id: number, collection: number) {
    const query = `DELETE FROM items WHERE id=${id}`;
    const result = await this.db.query(query);
    this.loadItems(collection);
    return result;
  }
}
