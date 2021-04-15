import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {
  url: any
  constructor(private MyAuthService: AuthService, private MyRouter: Router) { }
  intercept(req: any, next: any) {
    let tekonizedRequest1 = req.clone()
    let lastRequest: any
    if (tekonizedRequest1.url.includes(`/api/Authenticate/login`) || tekonizedRequest1.url.includes(`/api/Users/ForgetPassword`) || tekonizedRequest1.url.includes(`/api/Users/NewPassword`)) {
      lastRequest = req.clone({
        setHeaders: {
          "x-api-key": "ByYM000OLlMQG6VVVp1OH7Xzyr7gHuw1qvUC5dcGt3SNM"
        }
      })
    }
    else {
      if (this.MyAuthService.getToken()) {
        let token = "Bearer " + this.MyAuthService.getToken()
        lastRequest = req.clone({
          setHeaders: {
            'Authorization': token
          }
        })
      }
      else {
        localStorage.clear()
        this.MyRouter.navigate(['/login'])
      }

    }
    return next.handle(lastRequest)
  }
}
