import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FileValidator } from 'ngx-mat-file-input';
import { ConfirmComponent } from '../confirm/confirm.component';
import { CompanyService } from '../services/company/company.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {
  AddCompanyForm: any
  errorFlag: boolean = false
  existEmail: boolean = false
  Sent: boolean = false
  // Image Variable
  readonly maxSize = 104857600;
  images: boolean = false;
  formData: any;
  progress: number = 0;
  message: string;
  imagePath = [];
  imgURL: any
  compressedImages: any
  compresed: boolean = false
  /////////////////////////
  constructor(
    private imageCompress: NgxImageCompressService,
    private MyCompanyService: CompanyService,
    private MyRouter: Router, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private MyLocation: Location) { }

  ngOnInit(): void {
    this.AddCompanyForm = new FormGroup({
      NameAr: new FormControl('', [Validators.required]),
      NameEn: new FormControl('', [Validators.required]),
      adminName: new FormControl('', [Validators.required]),
      AdminPhone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{11}')]),
      NormalizedName: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      CompanyEmail: new FormControl('', [Validators.required, Validators.email]),
      Logo: new FormControl('', [Validators.required, FileValidator.maxContentSize(300000)]),
    })
  }

  OnAction() {
    this.Sent = true
    this.existEmail = false
    this.errorFlag = false
    let myData = new FormData
    myData.append('Logo', this.AddCompanyForm.value.Logo._files[0])
    myData.append('NameAr', this.AddCompanyForm.value.NameAr)
    myData.append('NameEn', this.AddCompanyForm.value.NameEn)
    myData.append('NormalizedName', this.AddCompanyForm.value.NormalizedName)
    myData.append('companyEmail', this.AddCompanyForm.value.CompanyEmail)
    this.MyCompanyService.AddCompany(myData).subscribe((respons: any) => {
      if (respons.message == "Creat Company Success") {
        this.MyCompanyService.GetShiftsInCompany(respons.data.id).subscribe((resp: any) => {
          if (resp.message == "Success") {
            this.MyCompanyService.AddUser({
              "Name": this.AddCompanyForm.value.adminName,
              "PhoneNo": this.AddCompanyForm.value.AdminPhone,
              "Email": this.AddCompanyForm.value.CompanyEmail,
              "JobTitle": "Admin",
              "UserType": 4,
              "ShiftId": resp.data[0].id
            }).subscribe((userData: any) => {
              if (userData.message == "User created successfully!") {
                this.openSnackBar('تم الاضافة بنجاح', '😀', 'green');
                this.MyRouter.navigate(['/'])
              }
              else if (resp.message == 'Fail : Email Already exists') {
                this.existEmail = true
                this.errorFlag = false
                return
              }
              else {
                this.Sent = false
                this.existEmail = false
                this.errorFlag = true
                return
              }
            })

          }
          else {
            this.Sent = false
            this.existEmail = false
            this.errorFlag = true
            return
          }
        })
      }
      else {
        this.Sent = false
        this.existEmail = false
        this.errorFlag = true
        return
      }
    })
  }

  get s() {
    return this.AddCompanyForm.controls
  }

  onFileChange(file: any) {
    this.compresed = false
    if (file.type.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    else {
      var reader = new FileReader();
      reader.onload = async (_event) => {
        this.imgURL = reader.result

        this.imageCompress.compressFile(this.imgURL, null, 50, 50).then(
          result => {
            debugger
            // split base64 string in data and contentType
            var block = result.split(";");
            // get the real base64 content of the file
            var realData = block[1].split(",")[1];
            // change from base64 to blob file
            var blob = this.dataURItoBlob(realData);
            let imageFile = new File([blob], file.name, { type: file.type });
            this.compressedImages = imageFile
            this.compresed = true

          })
      }
      debugger
      reader.readAsDataURL(file);
    }

    debugger
    if (this.compressedImages) {
      debugger
      this.AddCompanyForm.value.Logo = this.compressedImages
      this.compresed = true
      return this.compressedImages
    }

  }


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

  openSnackBar(message: string, action: string, color: any) {
    this._snackBar.open(message, action, {
      duration: 2000, panelClass: color, verticalPosition: 'top'
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  Confirm(element: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300',
      height: 'auto',
      data: { "data": element, "type": "add" }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.OnAction()
      }
    });
  }

  backClicked() {
    this.MyLocation.back();
  }

  normalize(event: any) {
    console.log(12 , event)
    this.AddCompanyForm.controls['NormalizedName'].setValue(((this.AddCompanyForm.value.NameEn.slice(0, 8)).replaceAll(" ", "")).toUpperCase())
  }

}
