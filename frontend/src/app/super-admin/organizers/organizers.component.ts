import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OrganizersService } from './organizers.service';

interface Organizer {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  isDeleted: boolean;
}
@Component({
  selector: 'app-organizers',
  templateUrl: './organizers.component.html',
  styleUrls: ['./organizers.component.css'],
})
export class OrganizersComponent {
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
    name: '',
    email: '',
    phone: '',
    location: '',
    status: '',
    isDeleted: false,
  };
  constructor(
    private organizersService: OrganizersService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getOrganizers();
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
      name: '',
      email: '',
      phone: '',
      location: '',
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
    let validationObject: any = this.dataValidator();
    if (validationObject.isValid) {
      this.organizersService.upsertOrganizer(this.selectedOrganizer).subscribe({
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
      this.toastr.warning(validationObject.message, 'Warning Message');
    }
  };

  dataValidator = () => {
    let validationObject: any = { isValid: true, message: '' };
    if (this.selectedOrganizer.name) {
      if (this.selectedOrganizer.email || this.selectedOrganizer.phone) {
        if (this.selectedOrganizer.location) {
          if (this.selectedOrganizer.status) {
            validationObject = { isValid: true, message: 'Valid data' };
          } else {
            validationObject = {
              isValid: false,
              message: 'Please select status',
            };
          }
        } else {
          validationObject = {
            isValid: false,
            message: 'Please select location of the organizer',
          };
        }
      } else {
        validationObject = {
          isValid: false,
          message:
            'Please enter either phone number or email id of the organizer',
        };
      }
    } else {
      validationObject = {
        isValid: false,
        message: 'Please enter name of the organizer',
      };
    }
    return validationObject;
  };

  confirmDelete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will not be able to recover "${item.name}"!`,
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
          Swal.fire('Deleted!', `"${org.name}" has been deleted.`, 'success');
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
    this.isDefaultView = false;
  }
}
