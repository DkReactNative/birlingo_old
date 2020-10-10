import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { GlobalService } from "../global.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  languageArray: any;
  login_with_social: any;
  gapi: any;
  public auth2: any;

  constructor(
    private titleService: Title,
    public global: GlobalService,
    public router: Router,
    public location: Location
  ) {
    this.getLanguageList();
  }

  ngOnInit() {
    this.fbLibrary();
  }

  setPageTitle(title: string) {
    this.titleService.setTitle(title);
    var element = document.getElementById("navbarSupportedContent");
    element.classList.remove("show");
  }

  logout() {
    localStorage.removeItem(btoa("blogData"));
    if (window.confirm(this.global.termsArray["msg_logout_confirm"])) {
      this.global.submitLoginHours();
      localStorage.removeItem(btoa("AuthToken"));
      localStorage.removeItem(btoa("routeParams"));
      this.global.routeParams = null;
      this.global.isLogin = false;
      this.global.AuthToken = null;
      this.signOut();
      this.getLanguageList();
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
    this.global.max_read_slide = null;
    this.global.lesson_title = null;
    localStorage.removeItem(btoa("lessonfamily_id"));
    localStorage.removeItem(btoa("baselesson_id"));
    localStorage.removeItem(btoa("lesson_id"));
    localStorage.removeItem(btoa("max_read_slide"));
    localStorage.removeItem(btoa("lesson_title"));
    this.global.user = null;
    document.body.classList.remove("texture-bg-gry");
    this.router.navigate(["/login"], { replaceUrl: true });
  }

  getLanguageList() {
    this.global.get(
      "languages",
      (data) => {
        localStorage.setItem(
          btoa("termArray"),
          btoa(JSON.stringify(data.data))
        );
        this.languageArray = data.data;
        this.languageArray.map((ele) => {
          if (ele._id == this.global.selectLanguage) {
            this.global.selectedLabel = this.global.termsArray[ele.term];
          }
        });
        if (data.data.lenght == 1) {
          this.selectLanguage(data.data[0]._id, data.data[0].label);
        }
        this.global.languageArray = data.data;
      },
      (err) => {},
      true
    );
  }

  selectLanguage(id, label) {
    console.log(id);
    this.global.selectedLabel = label;
    this.global.selectLanguage = id;
    localStorage.setItem(btoa("selectLanguage"), btoa(id));
    this.global.getTermsData();
    this.getLearningLanguage();
    location.reload();
  }

  getLearningLanguage() {
    this.global.get(
      "learningLanguages/" + this.global.selectLanguage,
      (data) => {
        this.global.learningLanguages = data.data.filter((ele) => {
          return ele._id != this.global.selectLanguage;
        });
        console.log("learning_language", data);
      },
      (err) => {}
    );
  }
}
