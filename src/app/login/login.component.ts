import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any
  cant: boolean = false
  hide: boolean = true
  submitted: boolean = false
  errorFlag: boolean = false
  constructor(private fb: FormBuilder, private MyAuthService: AuthService, private MyRouter: Router) { }

  ngOnInit(): void {
    if (this.MyAuthService.isLogedIn()) {
      this.MyRouter.navigate(['/'])
    }
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  Onsubmit() {
    this.cant = false
    debugger
    if (this.loginForm.value.username == "SACPAdmin" && this.loginForm.value.password == "CJJM3cTL#%s??Qh+") {
      this.MyAuthService.login({ "username": "AMHTECH10", "password": "Amh*1234" }).subscribe((resp: any) => {
        if (resp.message == "Failed : user name and password not match " || resp.status == "401") {
          this.cant = true
        }
        else if (resp.message == 'Success : ' && resp.userData.userType == 4) {
          this.MyAuthService.setValueWithExpire('token', resp.token, resp.expiration)
          // localStorage.setItem("token", resp.token)
          this.errorFlag = false
          this.MyRouter.navigate(['/'])
        }
        else {
          this.errorFlag = true
          this.cant = true
        }
      })
    }
    else {
      this.cant = true
    }

  }

  forgetPass() {

  }

  get l() {
    return this.loginForm.controls
  }

}
