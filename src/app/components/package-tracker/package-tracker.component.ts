import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-package-tracker',
  templateUrl: './package-tracker.component.html',
  styleUrls: ['./package-tracker.component.css']
})
export class PackageTrackerComponent implements OnInit {
  packageId!: string;
  package: any;
  delivery: any;

  constructor(private apiService: ApiService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.onDeliveryUpdate().subscribe((data) => {
      if (data.delivery_id === this.delivery.delivery_id) {
        this.delivery = data;
      }
    });
  }

  trackPackage(): void {
    this.apiService.getPackage(this.packageId).subscribe((deliveryPackage) => {
      this.delivery = deliveryPackage;
      if (deliveryPackage.active_delivery_id) {
        this.apiService.getDelivery(deliveryPackage.active_delivery_id).subscribe(delivery => {
          this.delivery = delivery;
          this.socketService.onDeliveryUpdate().subscribe((update: any) => {
            if (update._id === delivery._id) {
              this.delivery = update
            }
          });
        })
      }
    });
  }

}
