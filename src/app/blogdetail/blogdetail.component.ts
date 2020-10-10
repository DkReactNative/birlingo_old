import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../global.service";
import { Title, Meta } from "@angular/platform-browser";
import * as moment from "moment";

@Component({
  selector: "app-blogdetail",
  templateUrl: "./blogdetail.component.html",
  styleUrls: ["./blogdetail.component.scss"],
})
export class BlogdetailComponent implements OnInit {
  id;
  blogData;
  settingData;
  constructor(
    private route: ActivatedRoute,
    private metaTagService: Meta,
    public global: GlobalService,
    private router: Router,
    private titleService: Title,
    public location: Location
  ) {
    let user = localStorage.getItem(btoa("user"))
      ? atob(localStorage.getItem(btoa("user")))
      : null;
    user = JSON.parse(user);
    if (user) {
      this.router.navigate(["user"], { replaceUrl: true });
    }

    let blogData = localStorage.getItem("blogData");
    if (blogData) {
      blogData = JSON.parse(blogData);
      this.titleService.setTitle(blogData["title"]);
      this.metaTagService.updateTag({
        name: "description",
        content: blogData["introductory_text"]
          ? blogData["introductory_text"].slice(0, 160)
          : this.htmlParse(blogData["description"]),
      });
    }

    global.isBlogActive = true;
    this.route.paramMap.subscribe((params) => {
      this.id = params.get("id");
    });
    let body = {};
    body["slug"] = this.id;
    body["language_id"] =
      this.global.user && this.global.user.language_id
        ? this.global.user.language_id
        : this.global.selectLanguage
        ? this.global.selectLanguage
        : "";
    if (this.id) {
      this.global.get(
        "blog/" + body["language_id"] + "/" + body["slug"],
        (data) => {
          this.titleService.setTitle(data.data.records[0]["title"]);
          this.metaTagService.updateTag({
            name: "description",
            content: data.data.records[0]["introductory_text"]
              ? data.data.records[0]["introductory_text"].slice(0, 160)
              : this.htmlParse(data.data.records[0]["description"]),
          });
          this.blogData = data.data.records[0];
          document.getElementById("tabName").style.backgroundSize = "cover";
          document.getElementById("tabName").style.backgroundRepeat =
            "no-repeat";
          document.getElementById("cmspages_id2").innerHTML = this.blogData[
            "description"
          ]
            ? this.blogData["description"]
            : null;
        },
        (err) => {}
      );
    }
    this.getCopyRight();
  }

  ngOnInit() {}

  date(date) {
    return moment(new Date(date).toDateString()).format("DD.MM.YYYY");
  }

  ngOnDestroy() {
    this.global.isBlogActive = false;
  }

  goBack() {
    this.location.back();
  }
  getCopyRight() {
    this.global.get(
      "getSettingData",
      (data) => {
        this.metaTagService.updateTag({
          name: "keywords",
          content: data.data["blog_meta_keyword"],
        });
      },
      (err) => {}
    );
  }
  htmlParse(html) {
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent.length > 160
      ? temporalDivElement.textContent.substring(0, 160) + ""
      : temporalDivElement.textContent ||
        temporalDivElement.innerText.length > 160
      ? temporalDivElement.innerText.substring(0, 160) + ""
      : temporalDivElement.innerText || "";
  }
}
