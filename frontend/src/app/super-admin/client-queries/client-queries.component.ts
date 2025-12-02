import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ClientQueriesService } from './client-queries.service';

interface Query {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

@Component({
  selector: 'app-client-queries',
  templateUrl: './client-queries.component.html',
  styleUrls: ['./client-queries.component.css'],
})
export class ClientQueriesComponent {
  isDefaultView:boolean=true;
  queries: Query[] = [];
  filteredQueries: Query[] = [];
  selectedStatus = '';
  searchText: any = '';
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
 
  constructor(
    private clientQueriesService: ClientQueriesService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllQueries();
  }

  getAllQueries() {
    let requestObject: any = {
      currentPage: 1,
      pageSize: 10,
      searchText: '',
      status: '',
    };
    this.clientQueriesService.getAllQueries(requestObject).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.queries = response.data;
          this.filteredQueries = [...this.queries];
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
    this.filteredQueries = [...this.queries];
    this.currentPage = 1;
  }

  get paginatedQueries() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredQueries.slice(start, start + this.itemsPerPage);
  }

  totalPages() {
    return Math.ceil(this.filteredQueries.length / this.itemsPerPage);
  }


  confirmDelete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will not be able to recover "${item.subject}"!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteQuery(item);
      }
    });
  }

  deleteQuery(query: Query) {
    this.clientQueriesService.deleteQuery(query).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.getAllQueries();
          Swal.fire(
            'Deleted!',
            `"${query.subject}" has been deleted.`,
            'success'
          );
        } else {
          this.toastr.error(response.message, 'Error Message');
        }
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error Message');
      },
    });
  }
}
