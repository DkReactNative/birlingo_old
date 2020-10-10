import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route
} from "@angular/router";
import { Observable } from "rxjs";
import { GlobalService } from "./global.service";
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class Auth2Service implements CanActivate {
  isLogin = false;
  constructor(
    private _router: Router,
    public global: GlobalService,
    private route: ActivatedRoute
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let user = localStorage.getItem(btoa("user")) ? atob(localStorage.getItem(btoa("user"))) : null;
    user = JSON.parse(user);
    if (user) {
      this._router.navigate(["user"]);
      this.global.isLogin = true;
      return false;
    } else {
      this.global.isLogin = true;
    }
    return true;
  }
}
