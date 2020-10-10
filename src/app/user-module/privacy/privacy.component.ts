import { Location } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../global.service";
import { Router } from '@angular/router';

@Component({
  selector: "app-privacy",
  templateUrl: "./privacy.component.html",
  styleUrls: ["./privacy.component.scss"]
})
export class PrivacyComponent implements OnInit {
  languageId: any;
  policyArray: any = null;
  contentLoader:any=true;
  constructor(private route: ActivatedRoute, public global: GlobalService,
    public location: Location,public router:Router) {
    this.global.profileTab = 2
    this.getPrivacyList();
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.languageId = params.get("id")
        ? params.get("id")
        : this.global.selectLanguage
          ? this.global.selectLanguage
          : "5bd9ae3c9e254aecf7f031a9";
      console.log(params.get("id"));
    });
  }

  getPrivacyList() {
    let body = {};
    body["slug"] = "privacy-policy";
    body["language_id"] = this.languageId?this.languageId:this.global.selectLanguage;
    body["device"] = "web";
    this.global.post(
      "getCmsPageData",
      JSON.stringify(body),
      data => {
        this.policyArray = data.data[0] ? data.data[0] : null;
        if(!this.policyArray || this.policyArray==null || this.policyArray.length==0){
          this.contentLoader=false
        }
        console.log(data);
        document.getElementById("cmspages_id").innerHTML = this.policyArray['description'] ? this.policyArray['description'] : null;
      },
      err => { },
      true
    );
  }
  goBack(){
    this.router.navigate(['setting'], { replaceUrl: true })
  }
}
