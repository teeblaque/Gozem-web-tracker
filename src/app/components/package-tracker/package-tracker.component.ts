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
export class PackageTrackerComponent implements OnInit, OnDestroy {
  packageId: string = '';
  packageDetails: any = null;
  deliveryDetails: any = null;
  map: any;
  currentLocationMarker: any;
  sourceMarker: any;
  destinationMarker: any;

  constructor(private apiService: ApiService, private socketService: SocketService) {}

  ngOnInit(): void {
    this.initializeMap();
    this.socketService.onEvent('delivery_updated').subscribe((updatedDelivery) => {
      if (this.deliveryDetails && this.deliveryDetails.delivery_id === updatedDelivery.delivery_id) {
        this.deliveryDetails = updatedDelivery;
        this.updateMarkers();
      }
    });
  }

  ngOnDestroy(): void {}

  trackPackage() {
    this.apiService.getPackageByPackageId(this.packageId).subscribe(
      (pkg) => {
        this.packageDetails = pkg;
        if (this.packageDetails.active_delivery_id) {
          this.fetchDelivery(this.packageDetails.active_delivery_id);
        }
      },
      (error) => {
        console.error('Package not found', error);
        this.packageDetails = null;
        this.deliveryDetails = null;
      }
    );
  }

  fetchDelivery(deliveryId: string) {
    this.apiService.getDeliveryById(deliveryId).subscribe(
      (delivery) => {
        this.deliveryDetails = delivery[0];
        this.updateMarkers();
      },
      (error) => {
        console.error('Delivery not found', error);
        this.deliveryDetails = null;
      }
    );
  }


  initializeMap() {
    const mapProperties = {
      center: new google.maps.LatLng(0, 0),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapProperties);
  }

  updateMarkers() {
    if (this.deliveryDetails) {
      const source = this.packageDetails.from_location || { lat: 0, lng: 0 };
      const destination = this.packageDetails.to_location || { lat: 0, lng: 0 };
      const location = this.deliveryDetails.location || { lat: 0, lng: 0 };

      if (!this.sourceMarker) {
        this.sourceMarker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(source.lat, source.lng),
          label: 'S'
        });
      } else {
        this.sourceMarker.setPosition(new google.maps.LatLng(source.lat, source.lng));
      }

      if (!this.destinationMarker) {
        this.destinationMarker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(destination.lat, destination.lng),
          label: 'D'
        });
      } else {
        this.destinationMarker.setPosition(new google.maps.LatLng(destination.lat, destination.lng));
      }

      if (!this.currentLocationMarker) {
        this.currentLocationMarker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(location.lat, location.lng),
          label: 'C'
        });
      } else {
        this.currentLocationMarker.setPosition(new google.maps.LatLng(location.lat, location.lng));
      }
      this.map.setCenter(new google.maps.LatLng(location.lat, location.lng));
    }
  }
}
