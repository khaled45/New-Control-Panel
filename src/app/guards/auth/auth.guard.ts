import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private myRouter: Router, private MYAuthService: AuthService) {

  }
  canActivate(): boolean {
    if (this.MYAuthService.isLogedIn()) {
      return true
    }
    else {
      this.myRouter.navigate(['/login'])
      return true
    }
  }

}
