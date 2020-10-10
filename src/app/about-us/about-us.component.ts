import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../global.service";

@Component({
  selector: "about-us",
  templateUrl: "./about-us.component.html",
  styleUrls: ["./about-us.component.sass"]
})
export class AboutUsComponent implements OnInit {
  languageId: any;
  aboutArray = {};

  constructor(private route: ActivatedRoute, public global: GlobalService, public router: Router) {
    let user = localStorage.getItem(btoa("user")) ? atob(localStorage.getItem(btoa("user"))) : null;
    user = JSON.parse(user);
    if (user) {
      this.router.navigate(["user"],{replaceUrl:true});
    }
    this.route.paramMap.subscribe(params => {
      this.languageId = params.get("id")
        ? params.get("id")
        : this.global.selectLanguage
          ? this.global.selectLanguage : "5bd9ae3c9e254aecf7f031a9";
      console.log(params.get("id"));
    });

  }
  ngOnInit() {
    this.getList();
  }

  getList() {
    let body = {};
    body["slug"] = "about-us";
    body["language_id"] = this.languageId;
    body["device"] = "web";
    this.global.post(
      "getCmsPageData",
      JSON.stringify(body),
      data => {
        this.aboutArray = data.data[0];
        console.log(data);
      },
      err => { }
    );
  }
}
