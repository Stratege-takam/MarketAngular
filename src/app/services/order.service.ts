import { Injectable } from '@angular/core';
import {Order} from "../models/order.model";
import {OrderItem} from "../models/order-item.model";
import {Subject} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderSubject = new Subject<Order>();
  orderItemsSubject = new Subject<OrderItem[]>();
  private order: Order;
  private orderItems: OrderItem[] = [];

  emitOrderItems(){
    this.orderItemsSubject.next(this.orderItems.slice());
  }

  emitOrder(){
    this.orderSubject.next(this.order);
  }

  editOrder(orderObject: Order){
    this.order = orderObject;
    this.emitOrder();
  }

  setDeletedOrderItemId(orderItemId: number){
    if (!this.order.DeletedOrderItemIds || this.order.DeletedOrderItemIds === undefined || this.order.DeletedOrderItemIds === null) {
      this.order.DeletedOrderItemIds = "";
    }
    this.order.DeletedOrderItemIds += orderItemId + ",";
    this.emitOrder();
  }

  addOrderItem(orderItem: OrderItem){
    if (orderItem) {
      this.orderItems.push(orderItem);
      this.emitOrderItems();
    }
  }
  editOrderItem(orderItem: OrderItem,index){
    if (orderItem) {
      this.orderItems[index] = orderItem;
      this.emitOrderItems();
    }
  }

  removeOrderItem(index){
    this.orderItems.splice(index,1);
    this.emitOrderItems();
  }

  resetOrderItem(){
    this.orderItems = [];
    this.emitOrderItems();
  }

  saveOrUpdateOrder(){
    var body = {
      ...this.order,
      OrderItems: this.orderItems
    };
    return this.http.post(environment.apiURL+"Orders", body);
  }

  getOrderList(){
    return this.http.get(environment.apiURL+"Orders").toPromise();
  }

  setOrderItem(myOrderItems: OrderItem[]){
    this.orderItems = myOrderItems;
    this.emitOrderItems();
  }
  getOrderById(id: number):any{
    return this.http.get<any>(environment.apiURL+"Orders/"+id).toPromise();
  }

  deleteOrder(id: number){
    return this.http.delete(environment.apiURL+"Orders/"+id).toPromise();
  }

  constructor(private http: HttpClient) {
  }
}
