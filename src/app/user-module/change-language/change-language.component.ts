import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-choose-language",
  templateUrl: "./change-language.component.html",
  styleUrls: ["./change-language.component.sass"],
})
export class ChangeLanguageComponent implements OnInit {
  languageData: any;
  id: any;
  constructor(
    private route: Router,
    public global: GlobalService,
    public location: Location
  ) {
    this.global.profileTab = 2;
    this.id = global.selectLanguage;
    this.getLanguageData();
  }

  ngOnInit() {}

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
      true
    );
  }

  changeLanguage(id) {
    this.id = id;
  }
  updateLanguage() {
    if (!this.id) {
      alert("select language to update");
      return;
    }
    // this.global.selectLanguage = this.id;
    // localStorage.setItem(btoa("selectLanguage"), btoa(this.id));
    this.global.getTermsData(true, "msg_provide_language");
  }
  goBack() {
    this.route.navigate(["setting"], { replaceUrl: true });
  }
}
