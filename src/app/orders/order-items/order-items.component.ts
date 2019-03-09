import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {OrderItem} from "../../models/order-item.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ItemService} from "../../services/item.service";
import {Item} from "../../models/item.model";
import {NgForm} from "@angular/forms";
import {OrderService} from "../../services/order.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.scss']
})
export class OrderItemsComponent implements OnInit, OnDestroy {

  orderItem: OrderItem;
  itemList: Item[];
  isValid: boolean =true;
  orderSubscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService, private orderService: OrderService) {}


  onUpdatePrice(ctrl){
    const index = ctrl.selectedIndex;
    if (index=== 0) {
      this.orderItem.Price = 0;
      this.orderItem.ItemName = "";
    }
    else {
      this.orderItem.Price =  this.itemList[index-1].Price;
      this.orderItem.ItemName =  this.itemList[index-1].Name;
      this. onUpdateTotal();
    }
  }

  onUpdateTotal(){
    this.orderItem.Total = parseFloat ((this.orderItem.Quantity * this.orderItem.Price).toFixed(2));
  }

  ngOnInit() {
    this.itemService.getItemList().then(res => this.itemList =res as Item[]);
    const index = this.data.orderItemIndex;
    if (index === null)
    {
      this.orderItem = {
        Id: null,
        OrderId: this.data.orderId,
        ItemId: 0,
        ItemName: '',
        Price: 0,
        Quantity: 0,
        Total: 0
      }
    }
    else {
     this.orderSubscription =  this.orderService.orderItemsSubject.subscribe(
        (res: OrderItem[] )=> {
          console.log()
            this.orderItem = res[index];
        }
      );
     this.orderService.emitOrderItems();
    }

  }

  onSubmit(form:NgForm){

   if (this.validateForm(form.value)) {
     const myOrderItem = form.value as OrderItem;
     const index = this.data.orderItemIndex;
     if (index === null) {
       this.orderService.addOrderItem(myOrderItem);
     }
     else  {
       this.orderService.editOrderItem(myOrderItem,index);
     }
     this.dialogRef.close();
   }
  }


  validateForm(formData: OrderItem){
    this.isValid = true;
    if(formData.ItemId === 0){
      this.isValid = false;
    }
   else if(formData.Quantity === 0){
      this.isValid = false;
    }

    return this.isValid;
  }

  ngOnDestroy(): void {
    this.orderSubscription.unsubscribe();
  }


}
