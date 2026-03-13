import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  constructor(
    private http: HttpClient,
  ) {
  }

  @Output() filesSelected = new EventEmitter<File[]>(); // Send array to parent
  @Input() staticFiles:any = false;

  previewUrls: (string | ArrayBuffer | null)[] = [];
  selectedFiles: File[] = [];
  isDragOver = false;

  envUrl = environment.BASE_URL

  onFileSelected(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList) {
      this.addFiles(Array.from(fileList));
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const fileList = event.dataTransfer?.files;
    if (fileList) {
      this.addFiles(Array.from(fileList));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragOver = false;
  }

  addFiles(files: File[]) {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrls.push(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
    this.filesSelected.emit(this.selectedFiles);
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.filesSelected.emit(this.selectedFiles); // update parent
  }

  removeImageStatic(file: any) {
    console.log('file ', file);
    let imageId = file.id

    this.staticFiles = this.staticFiles.filter((item: any) => item.id !== imageId);
    let requestObject = {
      imageId
    };
    this.http
      .post(`${environment.BASE_URL}/api/deletedImage`, requestObject)
      .subscribe((res: any) => {
        console.log('res ', res);
        
       
      });
    
    // const index = this.staticFiles.indexOf(file);
    // if (index !== -1) {
    //   this.staticFiles.splice(index, 1);
    // }
  }

}
