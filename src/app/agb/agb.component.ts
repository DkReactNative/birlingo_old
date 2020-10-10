import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../global.service";

@Component({
  selector: "agb-app",
  templateUrl: "./agb.component.html",
  styleUrls: ["./agb.component.sass"]
})
export class AgbComponent implements OnInit {
  languageId: any;
  agbArray: any = null;
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
    body["slug"] = "agb";
    body["language_id"] = this.languageId?this.languageId:this.global.selectLanguage;
    body["device"] = "web";
    this.global.post(
      "getCmsPageData",
      JSON.stringify(body),
      data => {
        this.agbArray = data.data[0] ? data.data[0] : null;
        if(!this.agbArray || this.agbArray==null || this.agbArray.length==0){
          this.contentLoader=false
        }
        console.log(data);
        document.getElementById("cmspages_id").innerHTML = this.agbArray['description'] ? this.agbArray['description'] : null;
      },
      err => { },
      true
    );
  }
}
