import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import "rxjs/add/operator/map";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  mobileCms: any = false;
  // mobile cms page management
  loginTime: any = null;
  setupTime = environment.setupTime;
  setupHours = 24 * 60 * 60 * 1000;
  profileTab = 1;
  currentBlogPage: any = 1;
  termDate: any = localStorage.getItem(btoa("changeDate"))
    ? atob(localStorage.getItem(btoa("changeDate")))
    : new Date().toISOString();
  baselesson_id: any = localStorage.getItem(btoa("baselesson_id"))
    ? atob(localStorage.getItem(btoa("baselesson_id")))
    : null;
  lessonfamily_id: any = localStorage.getItem(btoa("lessonfamily_id"))
    ? atob(localStorage.getItem(btoa("lessonfamily_id")))
    : null;
  lesson_id: any = localStorage.getItem(btoa("lesson_id"))
    ? atob(localStorage.getItem(btoa("lesson_id")))
    : null;
  lesson_title: any = localStorage.getItem(btoa("lesson_title"))
    ? atob(localStorage.getItem(btoa("lesson_title")))
    : null;
  max_read_slide: any = localStorage.getItem(btoa("max_read_slide"))
    ? atob(localStorage.getItem(btoa("max_read_slide")))
    : null;
  isBlogActive = false;
  isLogin = false;
  blogData;
  loader;
  apiUrl = environment.apiUrl;
  languageArray = [];
  learningLanguages = [];
  selectLanguage = localStorage.getItem(btoa("selectLanguage"))
    ? atob(localStorage.getItem(btoa("selectLanguage")))
    : "5dea0938ec155c3df111d13c";
  termsArray = localStorage.getItem("termsArray")
    ? JSON.parse(localStorage.getItem("termsArray"))
    : [];
  selectedLabel: any = this.termsArray["lbl_choose_app_language"];
  user: any = null;
  AuthToken = null;
  routeParams;
  blogArray: any;
  learningLanguage: any =
    this.user && this.user.learning_language_id
      ? this.user.learning_language_id
      : null;
  formData: any;
  currentUserInterval: any = null;
  deviceInfo = null;
  max_767_width;
  isPhone: any = false;
  constructor(
    public http: HttpClient,
    public toastrService: ToastrService,
    private ngxService: NgxUiLoaderService,
    public router: Router
  ) {
    toastrService["options"] = {
      preventDuplicates: true,
      preventOpenDuplicates: true,
    };
  }

  public post(
    url,
    body,
    successCallback,
    failedCallback,
    loader = false,
    interval = 300,
    text = "Please wait..."
  ) {
    // localStorage.removeItem("blogData");
    let headers =
      this.AuthToken != null || this.AuthToken != undefined
        ? new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.AuthToken,
          })
        : new HttpHeaders({
            "Content-Type": "application/json",
          });

    let options = {
      headers: headers,
    };

    if (loader) {
      this.loader = true;
      this.ngxService.start();
    }

    this.http.post(this.apiUrl + url, body, options).subscribe(
      (data2) => {
        this.loader = false;
        setTimeout(() => {
          this.ngxService.stop();
        }, interval);
        let data;
        data = data2;
        if (
          data.success &&
          data.last_updated_date &&
          data.last_updated_date != ""
        ) {
          let difference =
            new Date(data.last_updated_date).getTime() -
            new Date(this.termDate).getTime();
          if (difference > 0) {
            this.getTermsData();
          }
        }
        successCallback(data);
      },
      (err) => {
        setTimeout(() => {
          this.ngxService.stop();
        }, 300);
        let online = window.navigator.onLine;
        let error = {};
        if (!online) {
          error["message"] = "Please check your internet";
        } else if (err.statusText) {
          error["message"] = err.statusText;
        } else {
          error["message"] =
            "Server is not responding. Please try again after some time";
        }
        this.loader = false;
        console.log("err => ", error);
        failedCallback(error);
      }
    );
  }

  get(url, successCallback, failedCallback, loader = false, interval = 300) {
    // localStorage.removeItem("blogData");
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.AuthToken,
    });

    let options = {
      headers: headers,
    };
    if (loader) {
      this.loader = true;
      this.ngxService.start();
    }

    this.http.get(this.apiUrl + url, options).subscribe(
      (data2) => {
        this.loader = false;
        setTimeout(() => {
          this.ngxService.stop();
        }, interval);
        let data;
        data = data2;
        if (
          data.success &&
          data.last_updated_date &&
          data.last_updated_date != ""
        ) {
          let difference =
            new Date(data.last_updated_date).getTime() -
            new Date(this.termDate).getTime();
          if (difference > 0) {
            this.getTermsData();
          }
        }
        successCallback(data);
      },
      (err) => {
        setTimeout(() => {
          this.ngxService.stop();
        }, 300);
        this.loader = false;
        let online = window.navigator.onLine;
        let error = {};
        if (!online) {
          error["message"] = "Please check your internet";
        } else if (err.statusText) {
          error["message"] = err.statusText;
        } else {
          error["message"] =
            "Server is not responding. Please try again after some time";
        }
        this.loader = false;
        console.log("err => ", error);
        failedCallback(error);
      }
    );
  }

  showToast(title = "", message = "") {
    this.toastrService.success("", message);
  }

  showDangerToast(title = "", message = "") {
    this.toastrService.error("", message);
  }

  showWarningToast(title = "", message = "") {
    this.toastrService.warning("", message);
  }

  getTermsData(flag = false, message = "") {
    this.post(
      this.isLogin ? "afterloginterms" : "terms",
      JSON.stringify({
        language_id:
          this.selectLanguage && this.selectLanguage != null
            ? this.selectLanguage
            : "5bd9ae3c9e254aecf7f031a9",
      }),
      (data) => {
        console.log(data);
        if (data.success) {
          if (JSON.stringify(data.data) != JSON.stringify({}) && data.data) {
            this.termsArray = data.data;
            localStorage.setItem("termsArray", JSON.stringify(data.data));
          }
          localStorage.setItem(
            btoa("selectLanguage"),
            btoa(this.selectLanguage)
          );
          localStorage.setItem(
            btoa("changeDate"),
            btoa(new Date().toISOString())
          );
          this.termDate = new Date().toISOString();
          if (flag) {
            this.currentUser();
            this.showToast("", this.termsArray[message]);
          }
        } else {
          this.showDangerToast("", this.termsArray[data.message]);
        }
      },
      (err) => {
        this.showDangerToast("Error", err.message);
      },
      true
    );
  }

  currentUser() {
    this.get(
      "currentUser",
      (data) => {
        console.log(data);
        if (data.success) {
          console.log(data);
          this.selectLanguage = data.data.language_id;
          localStorage.setItem(
            btoa("selectLanguage"),
            btoa(data.data.language_id)
          );
          this.learningLanguage = data.data.learning_language_id;
          localStorage.setItem(btoa("user"), btoa(JSON.stringify(data.data)));
          this.user = data.data;
          this.isLogin = true;
          localStorage.setItem(btoa("AuthToken"), btoa(data.data.token));
          this.AuthToken = data.data.token;
        }
      },
      (err) => {
        this.showDangerToast("Error", err.message);
      }
    );
  }

  submitLoginHours() {
    let minutes = Math.abs(
      (new Date().getTime() - this.loginTime.getTime()) / 60000
    );
    console.log(this.loginTime.getTime(), minutes);
    this.post(
      "updateLoginHrs",
      JSON.stringify({ totalmins: minutes }),
      (data) => {
        console.log(data);
        if (data.success) {
        }
      },
      (err) => {
        this.showDangerToast("Error", err.message);
      },
      true
    );
  }

  setCurrentUserInterval() {
    this.currentUserInterval = setInterval(() => {
      if (this.isLogin) {
        this.currentUser();
      } else {
        clearInterval(this.currentUserInterval);
      }
    }, 300000);
  }

  navigate(route, data) {
    localStorage.setItem(btoa("routeParams"), btoa(JSON.stringify(data)));
    this.routeParams = data;
    this.router.navigate(route);
    if (data.fb && data.fb == "fb") {
      setTimeout(() => {
        location.reload();
      }, 300);
    }
  }
}
