import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-imprint",
  templateUrl: "./imprint.component.html",
  styleUrls: ["./imprint.component.sass"]
})
export class ImprintComponent implements OnInit {
  languageId: any;
  imprintArray: any = null;
  contentLoader:any=true;
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
    body["slug"] = "imprint";
    body["language_id"] = this.languageId;
    body["device"] = "web";
    this.global.post(
      "getCmsPageData",
      JSON.stringify(body),
      data => {
        this.imprintArray = data.data[0] ? data.data[0] : null;
        if(!this.imprintArray || this.imprintArray==null || this.imprintArray.length==0){
          this.contentLoader=false
        }
        console.log(data);
        document.getElementById("cmspages_id").innerHTML = this.imprintArray['description'] ? this.imprintArray['description'] : null;
      },
      err => { },
      true
    );
  }
}
