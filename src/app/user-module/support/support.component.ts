import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../global.service";
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.scss"]
})
export class SupportComponent implements OnInit {
  languageId: any;
  supportArray: any = null;
  contentLoader:any=true;
  constructor(private route: ActivatedRoute, public global: GlobalService,
    public location: Location,public router:Router) {
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
    body["slug"] = "support";
    body["language_id"] =  this.languageId?this.languageId:this.global.selectLanguage;
    body["device"] = "web";
    this.global.post(
      "getCmsPageData",
      JSON.stringify(body),
      data => {
        this.supportArray = data.data[0] ? data.data[0] : null;
        if(!this.supportArray || this.supportArray==null || this.supportArray.length==0){
          this.contentLoader=false
        }
        console.log(data);
        document.getElementById("cmspages_id").innerHTML = this.supportArray['description'] ? this.supportArray['description'] : null;
      },
      err => { },
      true
    );
  }

  goBack(){
    this.router.navigate(['setting'], { replaceUrl: true })
  }
}
