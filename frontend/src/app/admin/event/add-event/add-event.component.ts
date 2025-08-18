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
  staticFiles: any = '';
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
    lat: 0,
    lng: 0,
    fullAddress: '',
    description: '',
    status: 'draft',
  };

  ticket_details = {
    eventId: '',
    ticket_name: '',
    ticket_description: '',
    no_of_tickets: '',
    ticket_price: '',
    isActive: true,
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
    const mapDiv = document.getElementById('map');
    if (!mapDiv || mapDiv.hasChildNodes()) {
      return; // Prevent duplicate map creation
    }

    const defaultLocation = { lat: 26.1157917, lng: 91.7085933 }; // Default to Guwahati

    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: defaultLocation,
        zoom: 13,
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
        this.event.lat = lat;
        this.event.lng = lng;

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
    if (this.activeForm === 2) {
      // Wait a tiny bit for the map div to be back in the DOM
      setTimeout(() => {
        this.initMap();
      }, 0);
    }

    this.nextStep();
  }

  // handlePrevious() {
  //   this.activeForm--;
  // }
  handlePrevious() {
    this.activeForm--;
    if (this.activeForm === 2) {
      // Wait a tiny bit for the map div to be back in the DOM
      setTimeout(() => {
        this.initMap();
      }, 0);
    }

    this.previousStep();
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
        this.saveTicket(eventId);
        this.toastr.success('Event added successfully');
        this.activeForm = 5;
      },
      (error) => {
        console.error('Submission error:', error);
      }
    );
  }

  saveTicket(eventId: any) {
    console.log('Ticket saved:', this.ticket_details);

    this.ticket_details.eventId = eventId;

    const ENDPOINT = `${environment.BASE_URL}/api/saveTicket`;
    const requestOptions = {
      method: 'post',
      data: this.ticket_details,
    };

    this.http.post(ENDPOINT, requestOptions).subscribe(
      (response: any) => {
        this.toastr.success('Ticket added successfully');
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
        console.log('Success');
        console.log('response here ', response);
        this.event = response.event;
        this.content = response.event.description;
        this.selectedFiles = response.eventImages;
        this.staticFiles = response.eventImages;
        this.ticket_details = response.ticket_details[0];
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

  // stepper
  currentStep = 1;

  steps = [
    { label: 'Basic Details', icon: 'fas fa-info-circle' },
    { label: 'Location Details', icon: 'fas fa-map-marker-alt' },
    { label: 'Ticket Details', icon: 'fas fa-ticket-alt' },
    { label: 'Photos', icon: 'fas fa-camera' },
  ];

  goToStep(step: number) {
    if (step <= this.currentStep) {
      this.currentStep = step;
      this.activeForm = step;
    }

    if (step === 2) {
      // Wait a tiny bit for the map div to be back in the DOM
      setTimeout(() => {
        this.initMap();
      }, 0);
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  reloadAddEvent() {
    window.location.reload();
  }
}
