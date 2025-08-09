import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  @Output() filesSelected = new EventEmitter<File[]>(); // Send array to parent

  previewUrls: (string | ArrayBuffer | null)[] = [];
  selectedFiles: File[] = [];
  isDragOver = false;

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


}
