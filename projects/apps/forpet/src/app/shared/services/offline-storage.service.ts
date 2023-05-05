import { Injectable } from '@angular/core';
import { Good, IBrandDto, IGoodGroupDto } from '../models/api-models';
import * as localforage from 'localforage';


interface MyDBTables {
  products: Good[];
  brands: IBrandDto[];
  categories: IGoodGroupDto[];
}
type TableName = keyof MyDBTables;

@Injectable({
  providedIn: 'root'
})
export class OfflineStorageService {

  private dbName = 'forpet';
  private dbVersion = 1;

  // this is product table
  private products = localforage.createInstance({
    name: this.dbName,
    storeName: 'products',
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
    version: this.dbVersion
  });

  // this is brand table
  private brands = localforage.createInstance({
    name: this.dbName,
    storeName: 'brands',
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
    version: this.dbVersion
  });

  // this is category table
  private categories = localforage.createInstance({
    name: this.dbName,
    storeName: 'categories',
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
    version: this.dbVersion
  });

  constructor() {
  }

  addItem<T extends { id: number | string }>(target: TableName, value: T) {
    return this[target].setItem(value.id.toString(), value);
  }

  addItems<T extends { id: number | string }>(target: TableName, value: T[]) {
    return Promise.all(value.map(p => this[target].setItem(p.id.toString(), p)));
  }

  getItem<T>(target: TableName, id: string | number) {
    return this[target].getItem(id.toString());
  }

  getItems<T>(target: TableName): Promise<any[]> {
    let ids: string[] = [];
    return this[target].iterate(function (value, key, iterationNumber) {
      ids.push(key);
    }).then(() => {
      return Promise.all(ids.map(p => this[target].getItem(p)));
    });
  }

  deleteItem(target: TableName, id: string | number) {
    return this[target].removeItem(id.toString());
  }

  deleteItems(target: TableName, ids: (string | number)[]) {
    return Promise.all(ids.map(p => this[target].removeItem(p.toString())));
  }

}
