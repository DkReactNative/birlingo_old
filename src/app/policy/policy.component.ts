import { Component, OnInit, Inject, SecurityContext,ViewEncapsulation  } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../global.service";
import { DomSanitizer, SafeValue } from '@angular/platform-browser'

@Component({
  selector: "app-policy",
  templateUrl: "./policy.component.html",
  styleUrls: ["./policy.component.scss"],
  encapsulation: ViewEncapsulation.None
})


export class PolicyComponent implements OnInit {
  languageId: any;
  policyArray: any = null;
  contentLoader:any=true;
  constructor(private route: ActivatedRoute, public router: Router, public global: GlobalService, @Inject(DomSanitizer) private readonly sanitizer: DomSanitizer) {
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
    this.getPrivacyList();
    localStorage.removeItem(btoa("routeParams"));
    this.global.routeParams = null
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

  unwrap(value: SafeValue | null): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
  }
}
