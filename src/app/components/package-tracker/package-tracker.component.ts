import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';

declare var google: any;
@Component({
  selector: 'app-package-tracker',
  templateUrl: './package-tracker.component.html',
  styleUrls: ['./package-tracker.component.css']
})
export class PackageTrackerComponent implements OnInit {
  packageId: string = '';
  package: any;
  delivery: any;
  deliveries: any[] = [];
  map: any;
  markers: any = {};

  @ViewChild('map', { static: true })
  mapElement!: ElementRef;

  constructor(private apiService: ApiService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.onEvent('delivery_updated').subscribe((updatedDelivery) => {
      if (this.delivery && this.delivery.delivery_id === updatedDelivery.delivery_id) {
        this.delivery = updatedDelivery;
        this.updateMarker('current', updatedDelivery.location);
      }
    });
    this.initializeMap();
  }

  updateMarker(type: string, position: { lat: number, lng: number }) {
    if (!this.markers[type]) {
      this.markers[type] = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(position.lat, position.lng),
        label: type.charAt(0).toUpperCase(),
      });
    } else {
      this.markers[type].setPosition(new google.maps.LatLng(position.lat, position.lng));
    }
  }

  initializeMap() {
    const mapProperties = {
      center: new google.maps.LatLng(0, 0),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
  }

  trackPackage(): void {
    this.apiService.getPackageByPackageId(this.packageId).subscribe((deliveryPackage) => {
      if (deliveryPackage) {
        this.package = deliveryPackage;
        if (this.package.active_delivery_id) {
          this.loadDeliveryDetails(this.package.active_delivery_id);
        }
      }
    });
  }

  loadDeliveryDetails(active_delivery_id: string) {
    this.apiService.getDeliveryById(active_delivery_id).subscribe(delivery => {
      this.delivery = delivery;
      this.updateMarker('current', this.delivery[0].location);
      this.socketService.emitEvent('track_delivery', { delivery_id: this.delivery[0].delivery_id });
    });
  }

}
