import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../global.service";
import * as moment from "moment";

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.scss"],
})
export class ReviewsComponent implements OnInit {
  reviewArray: any = null;
  fakeArray = new Array();
  currentPage: any;
  contentLoader: any = true;
  constructor(
    private route: ActivatedRoute,
    public global: GlobalService,
    public router: Router
  ) {
    let user = localStorage.getItem(btoa("user"))
      ? atob(localStorage.getItem(btoa("user")))
      : null;
    user = JSON.parse(user);
    if (user) {
      this.router.navigate(["user"], { replaceUrl: true });
    }
  }

  ngOnInit() {
    this.getList();
    localStorage.removeItem(btoa("routeParams"));
    this.global.routeParams = null;
  }
  getList(page = 1) {
    let body = {};
    body["language_id"] =
      this.global.user && this.global.user.language_id
        ? this.global.user.language_id
        : this.global.selectLanguage
        ? this.global.selectLanguage
        : "";
    body["page"] = page;

    this.global.post(
      "reviews",
      JSON.stringify(body),
      (data) => {
        this.currentPage = page - 1;
        this.reviewArray = data.data ? data.data : null;
        if (!this.reviewArray || this.reviewArray == null) {
          this.contentLoader = false;
        }
        if (data.data.ratinglist) {
          this.fakeArray = new Array(data.data.ratinglist.pages);
        }
        console.log(data);
      },
      (err) => {},
      true
    );
  }

  date(date) {
    return moment(new Date(date).toDateString()).format("DD.MM.YYYY");
  }
  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
}
