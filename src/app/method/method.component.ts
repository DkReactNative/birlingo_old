import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../global.service";
import { Router } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { resolve } from "url";
declare var $: any;

@Component({
  selector: "app-method",
  templateUrl: "./method.component.html",
  styleUrls: ["./method.component.scss"],
})
export class MethodComponent implements OnInit {
  content: any;
  testimonials: any;
  deviceInfo = null;
  max_767_width;
  isPhone: any = false;
  carosalHide = true;

  constructor(
    private metaTagService: Meta,
    public global: GlobalService,
    public route: Router,
    public breakpointObserver: BreakpointObserver,
    private titleService: Title
  ) {
    let user = localStorage.getItem(btoa("user"))
      ? atob(localStorage.getItem(btoa("user")))
      : null;
    user = JSON.parse(user);
    if (user) {
      this.route.navigate(["user"], { replaceUrl: true });
    }
    if (this.global.isPhone) {
      setTimeout(() => {
        this.carosalHide = false;
      }, 2000);
    } else {
      this.carosalHide = false;
    }
    this.getLearningLanguage();
    this.getMethodPageContent().then((promise) => {
      $(document).ready(() => {
        setTimeout(() => {
          $(".carousel").swipe({
            swipe: (
              event,
              direction,
              distance,
              duration,
              fingerCount,
              fingerData
            ) => {
              console.log("swipe");
              if (direction == "left") {
                $("#box-next").trigger("click");
              }
              if (direction == "right") {
                $("#box-pre").trigger("click");
              }
            },
            allowPageScroll: "vertical",
          });
        }, 1000);
      });
      this.getTestimonials();
    });
  }

  ngOnInit() {
    // setInterval(() => {
    //   console.log(window.innerWidth);
    // }, 1000);
    console.log("deviceInfo =>", this.deviceInfo);
    localStorage.removeItem(btoa("routeParams"));
    this.global.routeParams = null;

    this.breakpointObserver
      .observe(["(max-width: 767px)"])
      .subscribe((result) => {
        if (result.matches) {
          this.max_767_width = true;
        } else {
          this.max_767_width = false;
        }
      });
  }

  getMethodPageContent() {
    return new Promise((resolve, reject) => {
      let body = {};
      body["language_id"] = this.global.selectLanguage;
      this.global.post(
        "methodContent",
        JSON.stringify(body),
        (data) => {
          if (data.success) {
            this.titleService.setTitle(data.data["meta_title"]);
            this.metaTagService.updateTag({
              name: "keywords",
              content: data.data["meta_keywords"],
            });
            this.metaTagService.updateTag({
              name: "description",
              content: data.data["meta_description"],
            });
            console.log(data.data);
            this.content = data.data;
            document.getElementById(
              "learning_guarantee_texts"
            ).innerHTML = this.content["learning_guarantee_texts"];
            document.getElementById(
              "how_it_works_texts"
            ).innerHTML = this.content["how_it_works_texts"];
            document.getElementById(
              "hear_actively_texts"
            ).innerHTML = this.content["hear_actively_texts"];
            document.getElementById(
              "hear_passively_texts"
            ).innerHTML = this.content["hear_passively_texts"];
            document.getElementById("speak_texts").innerHTML = this.content[
              "speak_texts"
            ];
            document.getElementById("tabName2").style.backgroundSize = "cover";
            document.getElementById("tabName2").style.backgroundRepeat =
              "no-repeat";
            resolve(1);
          } else {
            this.global.showDangerToast(this.global.termsArray[data.message]);
            reject(0);
          }
        },
        (err) => {
          this.global.showDangerToast(err.message);
          reject(0);
        },
        true
      );
    });
  }

  getLearningLanguage() {
    this.global.get(
      "learningLanguages/" + this.global.selectLanguage,
      (data) => {
        this.global.learningLanguages = data.data.filter((ele) => {
          return ele._id != this.global.selectLanguage;
        });
        console.log("learning_language", data);
      },
      (err) => {}
    );
  }

  getTestimonials() {
    this.global.post(
      "testimonials",
      JSON.stringify({ language_id: this.global.selectLanguage }),
      (data) => {
        this.testimonials = data.data;
      },
      (err) => {
        this.global.showDangerToast[err.message];
      },
      true
    );
  }

  setPageTitle(title: string) {
    this.titleService.setTitle(title);
  }
  selectLanguage(id) {
    console.log(id);
    this.global.learningLanguage = id;
    this.route.navigate(["register"]);
  }
  generateFaq(id, answer) {
    document.getElementById(id).innerHTML = answer;
  }
}
