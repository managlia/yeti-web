import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SmallChatterService} from '../../../services/small-chatter.service';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-chatter-details',
  templateUrl: './chatter-details.component.html',
  styleUrls: ['./chatter-details.component.scss']
})
export class ChatterDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markers = [];

  newsItems: any;
  twitterItems: any;
  weatherItems: any;

  constructor(
    private smallChatterService: SmallChatterService,
    public dialogRef: MatDialogRef<ChatterDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.loadNews();
    this.loadTwitter();
    this.loadWeather();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadNews(): void {
    const aName = (this.data.entity.name) ? this.data.entity.name :
      this.data.entity.firstName + ' '  + this.data.entity.lastName;
    this.smallChatterService.getNews(aName)
      .subscribe(someNews => {
        this.newsItems = someNews;
      });
  }

  loadTwitter(): void {
    const aName = (this.data.entity.name) ? this.data.entity.name :
      this.data.entity.firstName + ' '  + this.data.entity.lastName;
    this.smallChatterService.getTwitter(aName)
      .subscribe(someTwitter => {
        this.twitterItems = someTwitter;
      });
  }

  loadWeather(): void {
    this.smallChatterService.getWeather(this.getLocationsFromEntity())
      .subscribe(someWeather => {
        this.weatherItems = someWeather;
        this.plotPointsOnMap();
      });
  }

  getLocationsFromEntity(): string[] {
    const locations = this.data.entity.addresses;
    return locations.map(a => {
      let fs = '';
      fs += a.address1 ? a.address1 + ' ' : '';
      fs += a.city ? a.city + ' ' : '';
      fs += a.stateId ? a.stateId + ' ' : '';
      fs += a.postalCode ? a.postalCode : '';
      return fs;
    })
  }

  markerHandler(marker): void {
    console.log('marker clicked ', marker);
  }

  plotPointsOnMap(): void {
    let lat_min = 9999999;
    let lat_max = -9999999;
    let lng_min = 99999999;
    let lng_max = -999999;

    const markers = this.weatherItems.map( weatherItem => {
        const marker = new google.maps.Marker({
          position: {lat: weatherItem.coords.lat, lng: weatherItem.coords.lng},
          label: weatherItem.coords.address,
          map: this.map
        });
        marker.addListener('click', () => {
          this.markerHandler(marker);
        });
        lat_min = (lat_min > weatherItem.coords.lat) ? weatherItem.coords.lat : lat_min;
        lat_max = (lat_max < weatherItem.coords.lat) ? weatherItem.coords.lat : lat_max;

        lng_min = (lng_min > weatherItem.coords.lng) ? weatherItem.coords.lng : lng_min;
        lng_max = (lng_max < weatherItem.coords.lng) ? weatherItem.coords.lng : lng_max;

        return marker;
    });

    this.map.setCenter(new google.maps.LatLng(
      ((lat_max + lat_min) / 2.0),
      ((lng_max + lng_min) / 2.0)
    ));
    this.map.fitBounds(new google.maps.LatLngBounds(
      new google.maps.LatLng(lat_min, lng_min),
      new google.maps.LatLng(lat_max, lng_max)
    ));
  }

  initMap = () => {
    const mapProp = {
      center: new google.maps.LatLng(39.8283, 98.5795),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  };


  close(): void {
    this.dialogRef.close();
  }
}
