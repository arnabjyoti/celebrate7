import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EventCategoriesService } from './event-categories.service';

interface EventCategory {
  id: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  isDeleted: boolean;
}

@Component({
  selector: 'app-event-categories',
  templateUrl: './event-categories.component.html',
  styleUrls: ['./event-categories.component.css']
})

export class EventCategoriesComponent {
  categories: EventCategory[] = [];
  filteredCategories: EventCategory[] = [];

  
  statuses: string[] = ['Active', 'Inactive'];

  selectedStatus = '';
  searchText: any = '';
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  selectedCategory: EventCategory = {
    id: 0,
    categoryName: '',
    createdAt:'',
    updatedAt:'',
    status: '',
    isDeleted: false,
  };
  constructor(
    private eventCategoriesService: EventCategoriesService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getEventCategories();
  }

  getEventCategories() {
    let requestObject: any = {
      currentPage: 1,
      pageSize: 10,
      searchText: '',
      status: '',
    };
    this.eventCategoriesService.getEventCategories(requestObject).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.categories = response.data;
          this.filteredCategories = [...this.categories];
        } else {
          this.toastr.error(response.message, 'Error Message');
        }
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error Message');
      },
    });
  }



  resetFilters() {
    this.selectedStatus = '';
    this.filteredCategories = [...this.categories];
    this.currentPage = 1;
  }

  resetSelectedCategory() {
    this.selectedCategory = {
      id: 0,
      categoryName: '',
      createdAt:'',
      updatedAt:'',
      status: '',
      isDeleted: false,
    };
  }

  get paginatedCategories() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCategories.slice(start, start + this.itemsPerPage);
  }

  totalPages() {
    return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
  }

  isDefaultView: boolean = true;
  setViewMode = (type: any) => {
    switch (type) {
      case 'New':
        this.resetSelectedCategory();
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

  upsertEventCategory = () => {
    let validationObject: any = this.dataValidator();
    if (validationObject.isValid) {
      this.eventCategoriesService.upsertEventCategory(this.selectedCategory).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.getEventCategories();
            this.toastr.success(
              response?.message,
              'Success Message'
            );
            this.isDefaultView = true;
            this.resetSelectedCategory();
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
    if (this.selectedCategory.categoryName) {
      validationObject = {
        isValid: true,
        message: 'Category name present',
      };
    } else {
      validationObject = {
        isValid: false,
        message: 'Please enter name of the category',
      };
    }
    return validationObject;
  };

  confirmDelete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will not be able to recover "${item.categoryName}"!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteEventCategory(item);
      }
    });
  }

  deleteEventCategory(category: EventCategory) {
    this.eventCategoriesService.deleteEventCategory(category).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.getEventCategories();
          Swal.fire('Deleted!', `"${category.categoryName}" has been deleted.`, 'success');
        } else {
          this.toastr.error(response.message, 'Error Message');
        }
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error Message');
      },
    });
  }

  editCategory(cat: EventCategory) {
    this.selectedCategory=cat;
    this.isDefaultView = false;
  }
}