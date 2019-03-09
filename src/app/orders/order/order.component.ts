import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Subscription} from "rxjs/index";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {OrderItem} from "../../models/order-item.model";
import {Order} from "../../models/order.model";
import {OrderService} from "../../services/order.service";
import {OrderItemsComponent} from "../order-items/order-items.component";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer.model";
import { ToastrService } from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  //orderForm: FormGroup;
  orderSubscription = new Subscription();
  orderItems: OrderItem[] = [];
  order:Order;
  customerList: Customer[];
  isValid: boolean = true;
  constructor(private orderService: OrderService, private dialog:MatDialog
              , private customerService: CustomerService,
              private toastr: ToastrService, private router: Router,
              private  currentRoute: ActivatedRoute
  ) { }
//private formBuilder: FormBuilder,
  //               private router: Router
  ngOnInit() {

    //this.initForm();
    this.orderSubscription = this.orderService.orderItemsSubject.subscribe(
      (myOrderItems: OrderItem[]) => {
        this.orderItems = myOrderItems;
      }
    );

    this.orderSubscription = this.orderService.orderSubject.subscribe(
      (myOrder: Order) => {
        this.order = myOrder;
      }
    );

    let id = this.currentRoute.snapshot.params['id'];
    if (!id || id === undefined || id === null){
      this.onResetForm();
    }
    else{
      console.log("hello id : ",id);
    this.orderService.getOrderById(+id).then(
      res => {
       // console.log("resources : ", res);
        this.orderService.editOrder(res.order);
        //console.log("order : ", this.order);
        this.orderService.setOrderItem(res.orderDetails);
        //console.log("orderitem : ", this.orderItems);
      }
    );
      this.customerService.getCustumerList().then(
        res => {
          this.customerList = res as Customer[];
        }
      );
    }


  }

  /* initForm() {
     this.orderForm = this.formBuilder.group({
       //Id: ['', Validators.required],
       OrderNo: ['', Validators.required],
       CustomerId: ['', Validators.required],
       PMethod: ['', Validators.required],
       GTotal: ['', Validators.required],
     });
   }
   */


  onResetForm(form?: NgForm){
    if (form = null)
      form.resetForm();
    this.order = {
      Id: 1,
      OrderNo: Math.floor(100000 + Math.random()*900000),
      CustomerId: 0,
      PMethod: '',
      GTotal: 0,
      DeletedOrderItemIds: ''
    }
    this.orderService.editOrder(this.order);
    this.orderService.resetOrderItem();

  }


  onAddOrEditOrderItem(orderItemIndex, orderId){
    //console.log("orderId : ", orderId);
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    dialogconfig.width = "50%";
    dialogconfig.data = {orderItemIndex, orderId};
    this.dialog.open(OrderItemsComponent,dialogconfig).afterClosed().subscribe(res => {
      this.onUpdateGrandTotal();
    });
  }



  onDeleteOrderItem(orderItemId: number,index: number){
    //console.log("my index", index);
    if (orderItemId!=null) {
      this.orderService.setDeletedOrderItemId(orderItemId);
      console.log(this.order.DeletedOrderItemIds);
    }
    this.orderService.removeOrderItem(index);
    this.onUpdateGrandTotal();
  }

  onUpdateGrandTotal(){
    this.order.GTotal = !this.orderItems || this.orderItems.length === 0 ?0 : this.orderItems.reduce(
      (previous, current) => {
        return previous + current.Total;
      },0);
    this.order.GTotal = parseFloat(this.order.GTotal.toFixed(2));
  }

  ngOnDestroy(): void {
    this.orderSubscription.unsubscribe();
  }

  validateForm(){
    this.isValid = true;

    if(this.order.CustomerId ===0){
      this.isValid = false;
    }
    else if(this.orderItems.length ===0){
      this.isValid = false;
    }
    else if(this.order.PMethod === ""){
      this.isValid = false;
    }

    return this.isValid;
  }


  onSubmitForm(form: NgForm){

    //this.toastr.success('Hello world!', 'Toastr fun!');
    if(this.validateForm()){
        this.orderService.editOrder(this.order);
        this.orderService.saveOrUpdateOrder().subscribe(
          res=> {
            this.onResetForm();
            console.log("finish");
            this.toastr.success("submitted Successfully", "Restaurent App.");
            this.router.navigate(["/orders"]);
          }
          /*,
          error => {
            console.log("error",error);
          },
          () => {
            console.log("finish");
          }
          */
        );
    }
  }



}
