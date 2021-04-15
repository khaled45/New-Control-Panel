import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private myHttpClient: HttpClient) { }

  GetCompanies() {
    return this.myHttpClient.get(environment.BaseUrl + "/api/Company")
  }

  AddCompany(data: any) {
    return this.myHttpClient.post(environment.BaseUrl + "/api/Company", data)
  }

  SuspendCompany(flag: boolean, companyId: any) {
    return this.myHttpClient.put(environment.BaseUrl + "/api/Company/companySuspend?companyId=" + companyId + "&suspend=" + flag, {})
  }

  EditeCompany(companyId: any, data: any) {
    return this.myHttpClient.put(environment.BaseUrl + "/api/Company/" + companyId, data)
  }

  AddUser(data: any) {
    return this.myHttpClient.post(environment.BaseUrl + '/api/Authenticate/register', data)
  }

  GetShiftsInCompany(companyId: any) {
    return this.myHttpClient.get(environment.BaseUrl + "/api/Shifts/GetAllShiftInCompany?companyId=" + companyId)
  }

  GetCompanyAttribute(companyId: any) {
    return this.myHttpClient.get(environment.BaseUrl + "/api/Company/GetCompanyAttributes/" + companyId)
  }

  ReSendMail(mail: any) {
    return this.myHttpClient.put(environment.BaseUrl + "/api/Users/ResendPasswordEmail/" + mail, {})
  }

}
