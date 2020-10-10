import { Location } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-choose-language",
  templateUrl: "./choose-language.component.html",
  styleUrls: ["./choose-language.component.sass"]
})
export class ChooseLanguageComponent implements OnInit {

  languageData: any;
  id: any;

  constructor(private route: Router, public global: GlobalService, public location: Location) {
    this.global.profileTab = 2
    this.getLanguageData()
  }

  ngOnInit() { }

  changeLanguage(id) {
    this.id = id;
  }

  getLanguageData() {
    this.global.get(
      "afterLoginlearningLanguages",
      data => {
        console.log(data);
        if (data.success) {
          this.languageData = data.data.languages.filter(ele => {
            return ele._id != this.global.selectLanguage
          });
          this.global.learningLanguages = data.data.languages.filter(ele => {
            return ele._id != this.global.selectLanguage
          });
        }
      },
      err => {
        this.global.showDangerToast("Error", err.message);
      },
      true
    );
  }

  updateLanguage() {
    if (!this.id) {
      alert("select language to update");
      return;
    }
    let body = {};
    body["learning_language_id"] = this.id;
    this.global.post(
      "updatelearninglang",
      body,
      data => {
        if (data.success) {
          console.log("data=>", data);
          this.global.user.learning_language_id = data.data;
          localStorage.setItem(btoa("user"), btoa(JSON.stringify(this.global.user)));
          this.global.showToast("", this.global.termsArray[data.message]);
          this.global.currentUser()
          this.route.navigate(['user'], { replaceUrl: true })
          //this.route.navigate(["setting"]);
        } else {
          this.global.showDangerToast("", this.global.termsArray[data.message]);
        }
      },
      err => {
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  goBack(){
    this.route.navigate(['setting'], { replaceUrl: true })
  }

}
