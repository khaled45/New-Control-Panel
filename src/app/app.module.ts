import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CompaniesComponent } from './companies/companies.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from './services/auth/auth.service';
import { TokenInterceptorService } from './services/tokenInterceptor/token-interceptor.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MaterialFileInputModule } from 'ngx-mat-file-input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmComponent } from './confirm/confirm.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditeCompanyComponent } from './edite-company/edite-company.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UploadImageComponent } from './upload-image/upload-image.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CompaniesComponent,
    AddCompanyComponent,
    NotFoundComponent,
    HomeComponent,
    ConfirmComponent,
    EditeCompanyComponent,
    UploadImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,

    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSidenavModule,
    MatTableModule,
    MaterialFileInputModule,
    MatIconModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [AuthService, NgxImageCompressService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }, { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }],
  entryComponents: [ConfirmComponent, EditeCompanyComponent, UploadImageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
