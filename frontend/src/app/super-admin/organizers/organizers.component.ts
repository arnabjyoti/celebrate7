import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OrganizersService } from './organizers.service';
import * as data from 'countrycitystatejson';

interface Organizer {
  id: number;
  organizer_name: string;
  contact_name: string;
  type_of_organization: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  country: string;
  state: string;
  city: string;
  status: string;
  isDeleted: boolean;
}
@Component({
  selector: 'app-organizers',
  templateUrl: './organizers.component.html',
  styleUrls: ['./organizers.component.css'],
})
export class OrganizersComponent {
   AllData: any = null;
  Countries: any = [];
  States: any = [];
  Cities: any = [];
  organizers: Organizer[] = [];
  filteredOrganizers: Organizer[] = [];

  // Filters
  locations: string[] = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Navi Mumbai",
  "Allahabad (Prayagraj)",
  "Ranchi",
  "Howrah",
  "Coimbatore",
  "Jabalpur",
  "Gwalior",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Chandigarh",
  "Guwahati",
  "Solapur",
  "Hubli–Dharwad",
  "Mysuru",
  "Tiruchirappalli",
  "Bareilly",
  "Aligarh",
  "Tiruppur",
  "Moradabad",
  "Jalandhar",
  "Bhubaneswar",
  "Salem",
  "Warangal",
  "Guntur",
  "Bhiwandi",
  "Saharanpur",
  "Gorakhpur",
  "Bikaner",
  "Amravati",
  "Noida",
  "Jamshedpur",
  "Bhilai",
  "Cuttack",
  "Firozabad",
  "Kochi",
  "Thiruvananthapuram",
  "Dehradun",
  "Udaipur",
  "Mangalore",
  "Belgaum",
  "Jhansi",
  "Jammu",
  "Shillong",
  "Imphal",
  "Aizawl",
  "Agartala",
  "Gangtok",
  "Itanagar",
  "Panaji",
  "Puducherry"
];
  statuses: string[] = ['Active', 'Inactive'];

  selectedLocation = '';
  selectedStatus = '';
  searchText: any = '';
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  selectedOrganizer: Organizer = {
    id: 0,
    organizer_name: '',
    contact_name:'',
    type_of_organization:'',
    name: '',
    email: '',
    phone: '',
    location:'',
    country: '',
    state: '',
    city: '',
    status: '',
    isDeleted: false,
  };
  constructor(
    private organizersService: OrganizersService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getOrganizers();
    this.AllData = data.getAll();
    this.Countries = data.getCountries();
  }

  getOrganizers() {
    let requestObject: any = {
      currentPage: 1,
      pageSize: 10,
      searchText: '',
      location: '',
      status: '',
    };
    this.organizersService.getOrganizers(requestObject).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.organizers = response.data;
          this.filteredOrganizers = [...this.organizers];
        } else {
          this.toastr.error(response.message, 'Error Message');
        }
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error Message');
      },
    });
  }

  applyFilters() {
    this.filteredOrganizers = this.organizers.filter((org) => {
      const locationMatch =
        !this.selectedLocation || org.location === this.selectedLocation;
      const statusMatch =
        !this.selectedStatus || org.status === this.selectedStatus;
      return locationMatch && statusMatch;
    });
    this.currentPage = 1; // Reset to first page
  }

  resetFilters() {
    this.selectedLocation = '';
    this.selectedStatus = '';
    this.filteredOrganizers = [...this.organizers];
    this.currentPage = 1;
  }

  resetSelectedOrganizer() {
    this.selectedOrganizer = {
      id: 0,
      organizer_name:'',
      contact_name:'',
      type_of_organization:'',
      name: '',
      email: '',
      phone: '',
      location:'',
      country: '',
      state: '',
      city: '',
      status: '',
      isDeleted: false,
    };
  }

  get paginatedOrganizers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrganizers.slice(start, start + this.itemsPerPage);
  }

  totalPages() {
    return Math.ceil(this.filteredOrganizers.length / this.itemsPerPage);
  }

  isDefaultView: boolean = true;
  setViewMode = (type: any) => {
    switch (type) {
      case 'New':
        this.resetSelectedOrganizer();
        this.isDefaultView = false;
        break;
      case 'Back':
        this.isDefaultView = true;
        break;
      case 'Cancel':
        this.isDefaultView = true;
        break;
    }
  };

  upsertOrganizer = () => {
    let requestObject: any = {
        organizerName: this.selectedOrganizer?.organizer_name,
        typeOfOrganizer: this.selectedOrganizer?.type_of_organization,
        contactName: this.selectedOrganizer?.contact_name,
        email: this.selectedOrganizer?.email,
        mobileNumber: this.selectedOrganizer?.phone,
        country: this.selectedOrganizer?.country,
        state: this.selectedOrganizer?.state,
        city: this.selectedOrganizer?.city,
    };
    let validationObject: any = this.dataValidator(requestObject);
    if (validationObject.isValid) {
      this.organizersService.organizerRegistration(requestObject).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.getOrganizers();
            this.toastr.success(
              response?.message,
              'Success Message'
            );
            this.isDefaultView = true;
            this.resetSelectedOrganizer();
          } else {
            this.toastr.error(response.message, 'Error Message');
          }
        },
        error: (err: any) => {
          this.toastr.error(err, 'Error Message');
        },
      });
    } else {
      this.toastr.warning(validationObject.warning, 'Warning Message');
    }
  };

  dataValidator = (requestObject:any) => {
    console.log("RequestObject===", requestObject);
    
    let validation: any = {
      isValid: true,
      warning: null
    };
    if (!requestObject.city) {
      validation.isValid = false;
      validation.warning = 'Please select your city';
    }
    if (!requestObject.state) {
      validation.isValid = false;
      validation.warning = 'Please select your state/region';
    }
    if (!requestObject.country) {
      validation.isValid = false;
      validation.warning = 'Please select your country';
    }
    if (!requestObject.contactName) {
      validation.isValid = false;
      validation.warning = 'Contact person name can not be left blank';
    }
    if (!requestObject.mobileNumber) {
      validation.isValid = false;
      validation.warning = 'Mobile number can not be left blank';
    }
    if (!requestObject.email) {
      validation.isValid = false;
      validation.warning = 'Email id can not be left blank';
    }
    if (!requestObject.typeOfOrganizer) {
      validation.isValid = false;
      validation.warning = 'Please select type of your organization';
    }
    if (!requestObject.organizerName) {
      validation.isValid = false;
      validation.warning = 'Organization name can not left blank';
    }
    return validation;
  };

  confirmDelete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will not be able to recover "${item.organizer_name}"!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteOrganizer(item);
      }
    });
  }

  deleteOrganizer(org: Organizer) {
    this.organizersService.deleteOrganizer(org).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.getOrganizers();
          Swal.fire('Deleted!', `"${org.organizer_name}" has been deleted.`, 'success');
        } else {
          this.toastr.error(response.message, 'Error Message');
        }
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error Message');
      },
    });
  }

  editOrganizer(org: Organizer) {
    this.selectedOrganizer=org;
    this.onChangeCountry();
    this.onChangeState();
    this.isDefaultView = false;
    console.log("this.selectedOrganizer==",this.selectedOrganizer);
  }

  onChangeCountry = () => {
    if (this.selectedOrganizer.country) {
      this.States = data.getStatesByShort(this.selectedOrganizer.country);
    } else {
      this.States = [];
    }
  };

  onChangeState = () => {
    if (this.selectedOrganizer.state) {
      let country: any = this.AllData[`${this.selectedOrganizer.country}`];
      this.Cities = country.states[`${this.selectedOrganizer.state}`];
    } else {
      this.Cities = [];
    }
  };

}
