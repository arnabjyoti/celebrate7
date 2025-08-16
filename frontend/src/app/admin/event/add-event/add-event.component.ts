import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
})
export class AddEventComponent implements OnInit, AfterViewInit {
  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  routeName: string = '';
  eventId: any;

  selectedFiles: File[] = [];
  staticFiles: any = 'abcd';
  submitted = false;
  content: string = '';
  activeForm = 1;

  event = {
    eventName: '',
    organizer: '',
    type: '',
    eventDate: '',
    eventTime: '',
    country: '',
    state: '',
    city: '',
    fullAddress: '',
    description: '',
    status: 'draft',
  };

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    const fullPath = this.route.snapshot.routeConfig?.path;
    const mainRoute = fullPath?.split('/')[0];
    this.routeName = mainRoute || '';

    if (this.routeName === 'edit-event') {
      this.getEventDetails(this.eventId);
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const defaultLocation = { lat: 26.1157917, lng: 91.7085933 }; // Default to Guwahati

    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: defaultLocation,
        zoom: 8,
      }
    );

    const marker = new google.maps.Marker({
      map,
      position: defaultLocation,
      draggable: true,
    });

    // Autocomplete setup
    const input = document.getElementById('mapSearch') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const location = place.geometry.location;
      map.setCenter(location);
      marker.setPosition(location);

      this.updateAddressFromCoords(location.lat(), location.lng());
    });

    // Map click listener – get location details on click
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat && lng) {
        const clickedLatLng = new google.maps.LatLng(lat, lng);
        marker.setPosition(clickedLatLng);
        map.panTo(clickedLatLng);

        this.updateAddressFromCoords(lat, lng);
      }
    });

    // When marker is dragged
    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      if (position) {
        const lat = position.lat();
        const lng = position.lng();
        this.updateAddressFromCoords(lat, lng);
      }
    });
  }

  updateAddressFromCoords(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const components = results[0].address_components;
        const getComponent = (type: string) =>
          components.find((c) => c.types.includes(type))?.long_name || '';

        this.event.country = getComponent('country');
        this.event.state = getComponent('administrative_area_level_1');
        this.event.city =
          getComponent('locality') || getComponent('sublocality');
        this.event.fullAddress = results[0].formatted_address;

        console.log('Location selected:', this.event);
        console.log('Components :', components);
        console.log('latlng :', latlng);
      } else {
        console.warn('Geocoder failed:', status);
      }
    });
  }

  onFilesReceived(files: File[]) {
    this.selectedFiles = files;
    console.log('Received files:', this.selectedFiles);
  }

  onChange(event: any) {
    console.log('Editor changed:', event.html);
  }

  handleNext() {
    this.activeForm++;
  }

  handlePrevious() {
    this.activeForm--;
  }

  onSubmit() {
    this.submitted = true;
    this.event.description = this.content;

    const ENDPOINT = `${environment.BASE_URL}/api/saveEvent`;
    const requestOptions = {
      method: 'post',
      data: this.event,
    };

    this.http.post(ENDPOINT, requestOptions).subscribe(
      (response: any) => {
        const eventId = response.event.id;
        this.manageImageUpload(eventId);
        this.toastr.success('Event added successfully');
      },
      (error) => {
        console.error('Submission error:', error);
      }
    );
  }

  manageImageUpload(eventId: any) {
    this.selectedFiles.forEach((file, index) => {
      const formData = new FormData();
      formData.append('eventId', eventId);
      formData.append('image', file);
      formData.append('title', `Title ${index}`);

      this.saveEventImg(formData);
    });
  }

  saveEventImg(imgData: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/saveEventImg`;

    this.http.post(ENDPOINT, imgData).subscribe(
      (res: any) => {
        console.log('Image upload response:', res);
      },
      (err) => {
        console.error('Upload failed:', err);
        alert('Upload Failed!');
      }
    );
  }

  getEventDetails(id: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getEventDetails?id=${id}`;

    this.http.get(ENDPOINT).subscribe(
      (response: any) => {
        this.event = response.event;
        this.content = response.event.description;
        this.selectedFiles = response.eventImages;
        this.staticFiles = response.eventImages;
      },
      (error) => {
        console.error('Error fetching event details:', error);
      }
    );
  }

  handleUpdate() {
    this.onUpdate();
  }

  onUpdate() {
    const ENDPOINT = `${environment.BASE_URL}/api/updateEvent`;
    const requestOptions = {
      method: 'post',
      data: this.event,
    };

    this.http.post(ENDPOINT, requestOptions).subscribe(
      (response: any) => {
        this.toastr.success('Event updated successfully');
      },
      (error) => {
        console.error('Update error:', error);
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
