import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-terms-condition",
  templateUrl: "./terms-condition.component.html",
  styleUrls: ["./terms-condition.component.scss"]
})
export class TermsConditionComponent implements OnInit {
  languageId: any;
  termArray: any = null;
  contentLoader:any=true
  constructor(private route: ActivatedRoute, public global: GlobalService, public router: Router) {
    let user = localStorage.getItem(btoa("user")) ? atob(localStorage.getItem(btoa("user"))) : null;
    user = JSON.parse(user);
    if (user) {
      this.router.navigate(["user"],{replaceUrl:true});
    }
    this.route.paramMap.subscribe(params => {
      this.global.mobileCms = params.get("id") ? true : false
      this.languageId = params.get("id")
        ? params.get("id")
        : this.global.selectLanguage
          ? this.global.selectLanguage
          : "5bd9ae3c9e254aecf7f031a9";
      console.log(params.get("id"));
    });

  }
  ngOnInit() {
    this.getList();
    localStorage.removeItem(btoa("routeParams"));
    this.global.routeParams = null
  }

  getList() {
    let body = {};
    body["slug"] = "term-condition";
    body["language_id"] =this.languageId?this.languageId:this.global.selectLanguage;
    body["device"] = "web";
    this.global.post(
      "getCmsPageData",
      JSON.stringify(body),
      data => {
        this.termArray = data.data[0] ? data.data[0] : null;
        if(!this.termArray || this.termArray==null || this.termArray.length==0){
          this.contentLoader=false
        }
        document.getElementById("cmspages_id").innerHTML = this.termArray['description'] ? this.termArray['description'] : null;
      },
      err => { },
      true
    );
  }
}
