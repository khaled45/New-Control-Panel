import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CompaniesComponent } from '../companies/companies.component';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  images = false;
  formData: any;
  progress = 0;
  message: string;
  imagePath = [];
  imgURL = [];
  compressedImages = []
  constructor(
    public Myrouter: Router,
    // private myUploadService: UploadServicesService,
    private imageCompress: NgxImageCompressService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<[CompaniesComponent]>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

  formatLabel(value: number) {
    if (value >= 10) {
      return Math.round(value / 10) + 'k';
    }
  }

  onFileChange(files: any) {
    let element = files[0]
    // files.forEach((element: any, ind: any) => {
    if (element.type.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    this.message = ''
    if (element.size > 300000) {
      this.message = 'max image size is 3 mb'
      return;
    }
    console.log(element, "HERE IS I AM")
    // convert image to base64
    var reader = new FileReader();
    reader.onload = (_event) => {

      this.imgURL.push(reader.result);

      // compress image


      // check if file size small than 12kb

      if (this.imageCompress.byteCount(this.imgURL[0]) > 126131) {
        this.imageCompress.compressFile(this.imgURL[0], null, 50, 50).then(
          result => {

            // split base64 string in data and contentType
            var block = result.split(";");

            // get the real base64 content of the file
            var realData = block[1].split(",")[1];

            // change from base64 to blob file
            var blob = this.dataURItoBlob(realData);
            let imageFile = new File([blob], element.name, { type: element.type });
            this.compressedImages.push(imageFile)
            console.log('result ==>', this.imageCompress.byteCount(result))
            console.log(this.compressedImages)


          })
      } else {
        this.compressedImages.push(element)
      }
      this.images = true;
    };

    // HOLLOOO
    reader.readAsDataURL(element);


    this.data = this.compressedImages

  }


  // convert image from base64 to blob file


  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }


}
