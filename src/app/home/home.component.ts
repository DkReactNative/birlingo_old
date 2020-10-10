import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../global.service";
import { Router } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.sass"],
})
export class HomeComponent implements OnInit {
  languageArray = ["English"];
  testimonials: any;
  homeContent: any = {};
  constructor(
    public global: GlobalService,
    private metaTagService: Meta,
    public route: Router,
    private titleService: Title
  ) {
    let user = localStorage.getItem(btoa("user"))
      ? atob(localStorage.getItem(btoa("user")))
      : null;
    user = JSON.parse(user);

    if (user) {
      this.route.navigate(["user"], { replaceUrl: true });
    }
    // this.titleService.setTitle("Swalla");
    this.getHomeContent();
    this.getLearningLanguage();
    console.log(this.global.selectLanguage);
    this.getTestimonials();
  }

  ngOnInit() {
    localStorage.removeItem(btoa("routeParams"));
    this.global.routeParams = null;
  }

  // getLanguageList() {
  //   this.global.get(
  //     "languages",
  //     data => {
  //       localStorage.setItem("data", JSON.stringify(data.data));
  //       this.languageArray = data.data;
  //       this.global.languageArray = data.data;
  //     },
  //     err => { },
  //     true
  //   );
  // }
  getLearningLanguage() {
    this.global.get(
      "learningLanguages/" + this.global.selectLanguage,
      (data) => {
        this.languageArray = data.data.filter((ele) => {
          return ele._id != this.global.selectLanguage;
        });
        this.global.learningLanguages = data.data.filter((ele) => {
          return ele._id != this.global.selectLanguage;
        });
        console.log("learning_language", data);
      },
      (err) => {}
    );
  }

  getHomeContent() {
    this.global.post(
      "home",
      JSON.stringify({ language_id: this.global.selectLanguage }),
      (data) => {
        this.titleService.setTitle(data.data["meta_title"]);
        this.titleService.setTitle(data.data["meta_title"]);
        this.metaTagService.updateTag({
          name: "keywords",
          content: data.data["meta_keywords"],
        });
        this.metaTagService.updateTag({
          name: "description",
          content: data.data["meta_description"],
        });
        this.homeContent = data.data;
        document.getElementById("learning_language_texts").innerHTML =
          data.data["learning_language_texts"];
        document.getElementById("speak_language_texts").innerHTML =
          data.data["speak_language_texts"];
        document.getElementById("our_mission_texts").innerHTML =
          data.data["our_mission_texts"];
        document.getElementById("content_yourself_texts").innerHTML =
          data.data["content_yourself_texts"];
        document.getElementById("content_yourself_texts").innerHTML =
          data.data["content_yourself_texts"];
        console.log(data);
        document.getElementById("tabName2").style.backgroundSize = "cover";
        document.getElementById("tabName2").style.backgroundRepeat =
          "no-repeat";
      },
      (err) => {
        this.global.showDangerToast[err.message];
      },
      true
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
  openUrl(type) {
    let obj = {
      1: "https://play.google.com/store/apps",
      2: "https://apps.apple.com/de/app/dawawas/id588285122",
    };
    window.open(obj[type], "_blank");
  }
  selectLanguage(id) {
    console.log(id);
    this.global.learningLanguage = id;
    this.route.navigate(["register"]);
  }
}
