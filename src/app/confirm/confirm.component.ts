import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AddCompanyComponent } from '../add-company/add-company.component';
import { CompaniesComponent } from '../companies/companies.component';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  imageBase: any = environment.BaseUrl
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddCompanyComponent, CompaniesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
