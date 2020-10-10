import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { GlobalService } from "../global.service";
import { Router } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import * as moment from "moment";
@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
  pageLimit: 1;
  blogArray: any;
  blogHeader: any;
  settingData;
  currentPage: any;
  fakeArray = new Array();
  constructor(
    public global: GlobalService,
    private metaTagService: Meta,
    public location: Location,
    public router: Router,
    private titleService: Title
  ) {
    let user = localStorage.getItem(btoa("user"))
      ? atob(localStorage.getItem(btoa("user")))
      : null;
    user = JSON.parse(user);
    if (user) {
      this.router.navigate(["user"], { replaceUrl: true });
    }
    this.getCopyRight();
    this.getBlogData(this.global.currentBlogPage);
    global.isBlogActive = true;
  }
  ngOnInit() {
    localStorage.removeItem(btoa("routeParams"));
    this.global.routeParams = null;
    localStorage.removeItem(btoa("blogData"));
    this.currentPage =
      this.global.currentBlogPage != null ? this.global.currentBlogPage : 1;
  }

  getBlogData(page = 1) {
    this.currentPage = page - 1;
    let body = {};
    body["language_id"] =
      this.global.user && this.global.user.language_id
        ? this.global.user.language_id
        : this.global.selectLanguage
        ? this.global.selectLanguage
        : "";
    body["page"] = page;

    this.global.post(
      "blogs",
      JSON.stringify(body),
      (data) => {
        this.pageLimit = data.data.pages;
        this.currentPage = page - 1;
        this.global.currentBlogPage = page;
        this.fakeArray = new Array(data.data.pages);
        this.blogArray = data.data.records;
        this.blogHeader = data.data.header_blog;
        this.global.blogArray = data.data.records;
        document.getElementById("tabName").style.backgroundSize = "cover";
        document.getElementById("tabName").style.backgroundRepeat = "no-repeat";
      },
      (err) => {},
      true
    );
  }

  date(date) {
    return moment(new Date(date).toDateString()).format("DD.MM.YYYY");
  }

  htmlParse(html) {
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent.length > 500
      ? temporalDivElement.textContent.substring(0, 500) + ""
      : temporalDivElement.textContent ||
        temporalDivElement.innerText.length > 500
      ? temporalDivElement.innerText.substring(0, 500) + ""
      : temporalDivElement.innerText || "";
    var doc: any = new DOMParser().parseFromString(html, "text/html");
    console.log(doc);
    return doc.length > 500 ? doc.substring(1, 500) + "...  " : doc;
    return html.replace(/(<([^>]+)>)/gi, "").length > 500
      ? html.replace(/(<([^>]+)>)/gi, "").substring(1, 500) + "...  "
      : html.replace(/(<([^>]+)>)/gi, "");
  }

  ngOnDestroy() {
    this.global.isBlogActive = false;
  }

  goBack() {
    if (this.currentPage == 0) {
      this.location.back();
    } else {
      this.getBlogData(this.currentPage);
      this.currentPage--;
    }
  }
  WordCount(str, index) {
    var totalSoFar = str.split(" ");
    if (index == 1) {
      totalSoFar = totalSoFar.slice(0, +totalSoFar.length / 3);
    }
    if (index == 2) {
      totalSoFar = totalSoFar.slice(
        +totalSoFar.length / 3,
        +((totalSoFar.length * 2) / 3)
      );
    }
    if (index == 3) {
      totalSoFar = totalSoFar.slice(
        +((totalSoFar.length * 2) / 3),
        +totalSoFar.length
      );
    }
    console.log(totalSoFar.join());
    return totalSoFar.join().replace(/,/g, " ");
  }
  getCopyRight() {
    this.global.get(
      "getSettingData",
      (data) => {
        // this.settingData = data.data;
        this.titleService.setTitle(data.data["blog_title"]);
        this.metaTagService.updateTag({
          name: "keywords",
          content: data.data["blog_meta_keyword"],
        });
        this.metaTagService.updateTag({
          name: "description",
          content: data.data["blog_meta_description"],
        });
      },
      (err) => {}
    );
  }
  setBlog(blog) {
    localStorage.setItem("blogData", JSON.stringify(blog));
    this.router.navigate(["blog-detail/" + blog.slug]);
  }
}
