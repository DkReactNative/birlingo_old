import { Component, OnDestroy } from "@angular/core";
import { GlobalService } from "./global.service";
import {
  Router,
  ActivatedRoute,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { SPINNER, POSITION, PB_DIRECTION } from "ngx-ui-loader";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "website";
  SPINNER = SPINNER;
  location: any;
  constructor(
    public global: GlobalService,
    // private ccService: NgcCookieConsentService,
    private deviceService: DeviceDetectorService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    // console.log = function () {};
    this.global.deviceInfo = this.deviceService.getDeviceInfo();
    this.global.isPhone =
      this.global.deviceInfo.os == "iOS" &&
      this.global.deviceInfo.device == "device"
        ? true
        : false;
    var now = new Date().getTime();
    var setupTime = localStorage.getItem("setupTime");
    console.log(now - parseInt(setupTime), this.global.setupHours);
    if (setupTime == null) {
      localStorage.setItem("setupTime", this.global.setupTime + "");
    } else {
      if (now - parseInt(setupTime) > this.global.setupHours) {
        localStorage.clear();
        localStorage.setItem("setupTime", this.global.setupTime + "");
      }
    }

    this.global.selectLanguage = localStorage.getItem(btoa("selectLanguage"))
      ? atob(localStorage.getItem(btoa("selectLanguage")))
      : "5dea0938ec155c3df111d13c";

    let user: any = localStorage.getItem(btoa("user"))
      ? atob(localStorage.getItem(btoa("user")))
      : null;
    user = JSON.parse(user);

    let AuthToken = localStorage.getItem(btoa("AuthToken"))
      ? atob(localStorage.getItem(btoa("AuthToken")))
      : null;
    if (user) {
      this.global.user = user;
      this.global.AuthToken = AuthToken;
      this.global.isLogin = true;
      this.global.selectLanguage = user.language_id;
      localStorage.setItem(btoa("selectLanguage"), btoa(user.language_id));
      this.global.learningLanguage = user.learning_language_id;
      this.global.setCurrentUserInterval();
      this.global.loginTime = new Date();
      //document.body.classList.add("texture-bg-gry");
    }
    router.events.subscribe(this.navigationInterceptor);
    let routeParam = localStorage.getItem(btoa("routeParams"))
      ? JSON.parse(atob(localStorage.getItem(btoa("routeParams"))))
      : null;
    this.global.routeParams = routeParam;
  }

  navigationInterceptor = (event: RouterEvent) => {
    if (event instanceof NavigationStart) {
      this.global.loader = true;
    }
    if (event instanceof NavigationEnd) {
      this.global.loader = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.global.loader = false;
    }
    if (event instanceof NavigationError) {
      this.global.loader = false;
    }
  };

  getLanguageList() {
    this.global.get(
      "languages",
      (data) => {
        localStorage.setItem(
          btoa("termArray"),
          btoa(JSON.stringify(data.data))
        );
        this.global.languageArray = data.data;
        this.global.getTermsData();
        console.log(this.global.selectLanguage);
        this.global.languageArray.filter((ele) => {
          if (String(ele._id) == String(this.global.selectLanguage)) {
            this.global.selectedLabel = this.global.termsArray[ele.term];
            console.log(this.global.selectedLabel);
          }
        });
      },
      (err) => {}
    );
  }

  ngOnInit() {
    window.addEventListener("beforeunload", (e) => {
      if (this.global.isLogin) {
        this.global.submitLoginHours();
      }
    });
    this.global.getTermsData();
    this.getLanguageList();
  }
  ngOnDestroy() {}
}
