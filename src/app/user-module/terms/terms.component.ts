import { Location } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../global.service";

@Component({
  selector: "app-terms",
  templateUrl: "./terms.component.html",
  styleUrls: ["./terms.component.scss"]
})
export class TermsComponent implements OnInit {
  languageId: any;
  termArray: any = null;
  contentLoader:any=true;
  constructor(private route: ActivatedRoute, public global: GlobalService,
    public location: Location) {
    this.global.profileTab = 2
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
  }

  getList() {
    let body = {};
    body["slug"] = "term-condition";
    body["language_id"] = this.languageId?this.languageId:this.global.selectLanguage;
    body["device"] = "web";
    this.global.post(
      "getCmsPageData",
      JSON.stringify(body),
      data => {
        this.termArray = data.data[0] ? data.data[0] : null;
        if(!this.termArray || this.termArray==null || this.termArray.length==0){
          this.contentLoader=false
        }
        console.log(data);
        document.getElementById("cmspages_id").innerHTML = this.termArray['description'] ? this.termArray['description'] : null;
      },
      err => { },
      true
    );
  }
}
