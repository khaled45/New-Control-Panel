import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompaniesComponent } from './companies/companies.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {
        path: '', component: CompaniesComponent
      },
      {
        path: 'addCompany', component: AddCompanyComponent
      }
    ],
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
