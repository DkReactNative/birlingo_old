import { Component, OnInit } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-susbscription",
  templateUrl: "./susbscription.component.html",
  styleUrls: ["./susbscription.component.scss"],
})
export class SusbscriptionComponent implements OnInit {
  susbcontent: any = null;
  constructor(public global: GlobalService, public router: Router) {
    this.getSubscriptionContent();
  }

  ngOnInit() {}

  getSubscriptionContent() {
    let body = {};

    this.global.get(
      "susbcontent",
      (data) => {
        console.log(data);
        if (data.success) {
          this.susbcontent = data.data;
          console.log(this.susbcontent);
        } else {
          this.global.showDangerToast(
            "Error",
            this.global.languageArray[data.message]
          );
        }
      },
      (err) => {
        this.global.showDangerToast("Error", err.message);
      },
      true
    );
  }
  submit() {
    this.router.navigate(["account"], { replaceUrl: true });
  }

  goBack() {
    this.router.navigate(["setting"], { replaceUrl: true });
  }
}
