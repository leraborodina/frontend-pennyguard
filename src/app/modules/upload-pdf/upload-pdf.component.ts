import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-pdf',
  templateUrl: './upload-pdf.component.html',
  styleUrl: './upload-pdf.component.scss'
})
export class UploadPdfComponent {
  selectedFile: File | null = null;
  
  constructor(private router: Router, private transactionService: TransactionService) { }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.handleFiles(inputElement.files);
    }
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file && file.type === 'application/pdf') {
        // Call the uploadFile function to handle the file upload
        this.selectedFile = file;
        this.uploadFile();
      } else if (file) {
        console.warn('Ignoring non-PDF file:', file);
      }
    }
  }
  
  uploadFile(): void {
    if (!this.selectedFile) {
      this.showErrorMessage('Please select a file to upload.');
      return;
    }

    // Call a service method to upload the file
    this.transactionService.uploadPDF(this.selectedFile).subscribe(
      () => {
        // File uploaded successfully
        this.showSuccessMessage('File uploaded successfully.');
        // Optionally, perform any additional actions after successful upload
        // Redirect to transaction overview page
        this.router.navigate(['/transaction-overview']);
      },
      (error: any) => {
        console.error('Error uploading file:', error);
        this.showErrorMessage('An error occurred while uploading the file. Please try again.');
      }
    );
  }

  private showErrorMessage(message: string): void {
    // Implement your error message display logic here
    console.error(message);
  }

  private showSuccessMessage(message: string): void {
    // Implement your success message display logic here
    console.log(message);
  }
}
