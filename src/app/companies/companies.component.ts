import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { ConfirmComponent } from '../confirm/confirm.component';
import { EditeCompanyComponent } from '../edite-company/edite-company.component';
import { CompanyService } from '../services/company/company.service';
import { UploadImageComponent } from '../upload-image/upload-image.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  CompaniesData: any
  displayedColumns: any
  CurrentUserdata: any
  imageBase: string = environment.BaseUrl
  selectedRowIndexUser = -1
  filteredArray: any = []
  loading: boolean = true
  constructor(private MyCompanyService: CompanyService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditeCompanyComponent, UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {



    this.displayedColumns = ["EnName", "email", "MaxSites", "MaxUsers", "Suspend"];

    this.MyCompanyService.GetCompanies().subscribe((resp: any) => {
      if (resp.message == "Success") {
        this.CompaniesData = resp.data
        this.filteredArray = resp.data
        this.CurrentUserdata = this.CompaniesData[0]
        this.highlightUser(this.CompaniesData[0])
        console.log(this.CompaniesData)
      }
    })
  }
  editeUser() {

  }
  Suspend(flag: boolean, CompanyId: any) {
    this.MyCompanyService.SuspendCompany(flag, CompanyId).subscribe((resp: any) => {
      if (resp.message = "Success : Suspend Company Success") {
        this.CompaniesData.forEach((element: any) => {
          if (element.id == CompanyId) {
            element.companySuspend = flag
            return
          }
        });
      }
    })
  }

  highlightUser(row: any) {
    this.loading = true
    this.filteredArray.find((element: any) => {
      if (element.id == row.id) {
        if (element.CurrentSites || element.CurrentUsers || element.CurrentShifts) {
          this.selectedRowIndexUser = row.id;
          this.CurrentUserdata = row
          this.loading = false
          return
        }
        else {
          this.MyCompanyService.GetCompanyAttribute(row.id).subscribe((resp: any) => {
            if (resp.message == "Success") {
              this.CompaniesData.find((element: any) => {
                if (element.id == row.id) {
                  element.CurrentSites = resp.data.sites
                  element.CurrentUsers = resp.data.users
                  element.CurrentShifts = resp.data.shifts
                  this.selectedRowIndexUser = row.id;
                  this.CurrentUserdata = element
                  this.loading = false
                  this.filteredArray.find((current: any) => {
                    if (current.id == row.id) {
                      current = element
                      this.loading = false
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
    // this.selectedRowIndexUser = row.id;
    // this.CurrentUserdata = row
  }

  editeCompany(element: any) {
    const dialogRef = this.dialog.open(EditeCompanyComponent, {
      width: '300',
      height: 'auto',
      data: element
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.CompaniesData.forEach((element: any, index: any) => {
          if (element?.id == result?.id) {
            // element = result
            element.nameAr = result.nameAr
            element.nameEn = result.nameEn
            element.companyEmail = result.companyEmail
            element.companySites = result.companySites
            element.companyUsers = result.companyUsers
            // element.

          }
        })

        this.filteredArray.forEach((element1: any, index: any) => {
          if (element1.id == result.id) {
            debugger
            // element = result
            element.nameAr = result.nameAr
            element.nameEn = result.nameEn
            element.companyEmail = result.companyEmail
            element.companySites = result.companySites
            element.companyUsers = result.companyUsers
            // element1 = result

          }
        })
      }


    });

  }

  applyFilter(event: any) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.toLowerCase();
    if (filterValue == '') {
      this.filteredArray = this.CompaniesData
    }
    else {
      this.filteredArray = this.CompaniesData.filter(option => (option.nameEn.includes(filterValue) || option.nameAr.includes(filterValue) || option.companyEmail.includes(filterValue)))
    }

  }

  Confirm(flag: boolean, CompanyData: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300',
      height: 'auto',
      data: { "data": { "suspend": flag, "CompanyName": CompanyData.nameAr }, "type": "suspend" }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.Suspend(flag, CompanyData.id)
      }
    });
  }




  changeCompanyImage(element: any) {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      width: '200',
      height: '200',
      data: element
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.EditeCompanyLogo(result[0], element)

      }
    });
  }

  EditeCompanyLogo(Logo: any, CompanyData: any) {
    let myData = new FormData
    myData.append('Logo', Logo)
    myData.append('NameAr', CompanyData.nameAr)
    myData.append('NameEn', CompanyData.nameEn)
    console.log(CompanyData.id, Logo)
    this.MyCompanyService.EditeCompany(CompanyData.id, myData).subscribe((resp: any) => {
      if (resp.message == 'Success: Company Data Updated') {
        console.log(resp)
        this.CompaniesData.forEach((element: any, index: any) => {
          if (element?.id == resp?.data.id) {
            element.logo = resp.data.logo
          }
        })

        this.filteredArray.forEach((element: any, index: any) => {
          if (element?.id == resp?.data.id) {
            // element = result
            element.logo = resp.data.logo
          }
        })
        this.CurrentUserdata.logo = resp.data.logo
        this.openSnackBar('تم تغيير الصورة بنجاح', '😀', 'green');

      }

    })
  }

  openSnackBar(message: string, action: string, color: any) {
    this._snackBar.open(message, action, {
      duration: 2000, panelClass: color, verticalPosition: 'top'
    });
  }


  ReSendMail(Email: any) {
    this.MyCompanyService.ReSendMail(Email).subscribe((resp: any) => {
      console.log(resp)
      if (resp.message == "Fail : User not found") {
        this.openSnackBar('عذرا البريد الاليكتروني غير موجود !', '', 'red');
      }
      else if (resp.message == "Fail : It is not a new user") {
        this.openSnackBar('هذا الحساب تم تفعيله مسبقاً', '', 'red');
      }
      else if (resp.message == "Success : Mail Sent Successfully") {
        this.openSnackBar('تمت اعادة ارسال البريد الاليكتروني بنجاح', '', 'green');
      }
      else {
        this.openSnackBar('حدث خطأ !', '', 'red');
      }
    })
  }
}
