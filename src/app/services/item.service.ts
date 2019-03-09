import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Item} from "../models/item.model";

@Injectable({
  providedIn: 'root'
})
export class ItemService {


  constructor(private http: HttpClient) { }

  getItemList(){
   return this.http.get<Item[]>(environment.apiURL +"Items").toPromise();
  }

}
