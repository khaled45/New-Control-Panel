import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileValidator } from 'ngx-mat-file-input';
import { environment } from 'src/environments/environment';
import { CompaniesComponent } from '../companies/companies.component';
import { CompanyService } from '../services/company/company.service';

@Component({
  selector: 'app-edite-company',
  templateUrl: './edite-company.component.html',
  styleUrls: ['./edite-company.component.scss']
})
export class EditeCompanyComponent implements OnInit {
  EditeCompanyForm: any
  errorFlag: boolean = false
  existEmail: boolean = false
  Sent: boolean = false
  ImageUrl: any
  BaseUrl: any = environment.BaseUrl
  constructor(private MyCompanyService: CompanyService,
    private MyRouter: Router, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CompaniesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.EditeCompanyForm = new FormGroup({
      NameAr: new FormControl(this.data.nameAr, [Validators.required]),
      NameEn: new FormControl(this.data.nameEn, [Validators.required]),
      NormalizedName: new FormControl(this.data.normalizedName, [Validators.required]),
      CompanyEmail: new FormControl(this.data.companyEmail, [Validators.required, Validators.email]),
      MaxSites: new FormControl(this.data.companySites, [Validators.required]),
      MaxUsers: new FormControl(this.data.companyUsers, [Validators.required]),
      // Logo: new FormControl(this.data.logo, [Validators.required, FileValidator.maxContentSize(300000)]),
    })
  }

  /**
   * companyEmail: "info@alhamd.com"
  companySites: 20
  companyState: 0
  companySuspend: false
  companyUsers: 100
  id: 3
  logo: "Resources/Images/ALHAMD.jpeg"
  nameAr: "الحمد للمقاولات"
  nameEn: "ALHAMD"
  normalizedName: "ALHAMD"
  plFooter: null
  plHeader: null
  prFooter: null
  prHeader: null
  sites: null
  */
  OnAction() {
    debugger
    this.Sent = true
    let myData = new FormData
    // myData.append('Logo', this.EditeCompanyForm.value.Logo._files[0])
    myData.append('NameAr', this.EditeCompanyForm.value.NameAr)
    myData.append('NameEn', this.EditeCompanyForm.value.NameEn)
    myData.append('NormalizedName', this.EditeCompanyForm.value.NormalizedName)
    myData.append('companyEmail', this.EditeCompanyForm.value.CompanyEmail)
    myData.append('companySites', this.EditeCompanyForm.value.MaxSites)
    myData.append('companyUsers', this.EditeCompanyForm.value.MaxUsers)
    // myData.append('Logo', this.EditeCompanyForm.value.Logo._files[0])
    this.MyCompanyService.EditeCompany(this.data.id, myData).subscribe((respons: any) => {
      if (respons.message == "Success: Company Data Updated") {
        this.openSnackBar('تم التعديل بنجاح', '😀', 'green');
        this.dialogRef.close(respons.data);
      }
      else {
        this.Sent = false
        this.errorFlag = true
        return
      }
    })
  }

  get s() {
    return this.EditeCompanyForm.controls
  }

  openSnackBar(message: string, action: string, color: any) {
    this._snackBar.open(message, action, {
      duration: 2000, panelClass: color, verticalPosition: 'top'
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  onFileChange(file: any) {
    var reader = new FileReader();
    reader.onload = async (_event) => {
      this.ImageUrl = reader.result
      return
    }
  }


}
