import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderService} from "../services/order.service";
import {Order} from "../models/order.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orderList: any[] = [];

  constructor(private orderService: OrderService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.refreshList();
  }


  onOpenForEdit(id: number){
    //console.log("id is : ", id);
    this.router.navigate(['order','edit',id]);
  }

  onOderDelete(id: number){
      if (confirm("Are you  sure to delete this record ?")) {
        this.orderService.deleteOrder(id).then(
          res => {
            console.log("on delete",res);
            this.refreshList();
            this.toastr.warning("Deleted Successfully", "Restaurent App.");
          }
        );
      }

  }

  refreshList(){
    this.orderService.getOrderList().then(
      (res)=> {
        this.orderList = res as any[];
      }
    )
  }
}
