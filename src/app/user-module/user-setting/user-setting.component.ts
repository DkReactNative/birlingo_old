import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-user-setting",
  templateUrl: "./user-setting.component.html",
  styleUrls: ["./user-setting.component.scss"],
})
export class UserSettingComponent implements OnInit {
  gapi: any;
  public auth2: any;
  languageData;
  login_with_social: any;
  constructor(private route: Router, public global: GlobalService) {
    this.global.profileTab = 2;
    this.getLanguageData();
  }

  ngOnInit() {}

  logout() {
    if (confirm(this.global.termsArray["msg_logout_confirm"])) {
      this.global.submitLoginHours();
      localStorage.removeItem(btoa("AuthToken"));
      localStorage.removeItem(btoa("routeParams"));
      this.global.routeParams = null;
      this.global.isLogin = false;
      this.global.AuthToken = null;
      this.signOut();
    }
  }

  fbLibrary() {
    (window as any).fbAsyncInit = function () {
      window["FB"].init({
        appId: "434838987192361",
        cookie: true,
        xfbml: true,
        version: "v3.1",
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }
  signOut() {
    if (this.global.user.login_with_social == 1) {
      window["gapi"].load("auth2", () => {
        this.auth2 = window["gapi"].auth2.getAuthInstance();
        this.auth2.signOut().then(() => {});
        //this.attachSignout(document.getElementById('googleBtn2'));
      });
      window["FB"].logout(function (response) {
        console.log("User signed out.", response);
      });
    }
    localStorage.removeItem(btoa("user"));
    this.global.lessonfamily_id = null;
    this.global.baselesson_id = null;
    this.global.lesson_id = null;
    this.global.lesson_title = null;
    this.global.max_read_slide = null;
    localStorage.removeItem(btoa("lessonfamily_id"));
    localStorage.removeItem(btoa("baselesson_id"));
    localStorage.removeItem(btoa("lesson_id"));
    localStorage.removeItem(btoa("lesson_title"));
    localStorage.removeItem(btoa("max_read_slide"));
    this.global.user = null;
    document.body.classList.remove("texture-bg-gry");
    this.route.navigate(["/login"], { replaceUrl: true });
  }
  getLanguageData() {
    this.global.get(
      "getLanguageList",
      (data) => {
        console.log(data);
        if (data.success) {
          this.languageData = data.data;
          this.global.languageArray = data.data;
        }
      },
      (err) => {
        this.global.showDangerToast("Error", err.message);
      },
      false,
      10
    );
  }
  navigate(url) {
    this.route.navigate([url]);
  }

  alert() {
    window.alert("Development continues! Apply later ");
  }
}
