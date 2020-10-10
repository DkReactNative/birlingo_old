import { Component, OnInit } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-rate",
  templateUrl: "./rate.component.html",
  styleUrls: ["./rate.component.scss"],
})
export class RateComponent implements OnInit {
  likeShow = true;
  feedBackShow = false;
  giveRateShow = false;
  directFeedback: any = false;
  directFeedShow: any = false;
  public: any = null;
  rating: any = new Array(5);
  feedback: any = null;
  like: any = null;
  alreadyRated: any = false;

  constructor(
    public global: GlobalService,
    public location: Location,
    public router: Router
  ) {
    this.global.profileTab = 2;
    //this.getRating()
  }

  ngOnInit() {}
  ngOnDestroy() {}

  giveLike(type) {
    this.likeShow = false;
    if (type) {
      this.like = true;
      //this.submitRating(true)
      //setTimeout(() => {  this.alreadyRated?this.giveRateShow = true:this.feedBackShow = true }, 500)
      setTimeout(() => {
        this.feedBackShow = true;
      }, 300);
    } else {
      this.like = false;
      setTimeout(() => {
        this.directFeedShow = true;
      }, 300);
      // this.submitRating(true)
      // this.location.back()
    }
  }

  giveFeedback(type) {
    this.feedBackShow = false;
    if (type) {
      setTimeout(() => {
        this.giveRateShow = true;
      }, 300);
    } else {
      setTimeout(() => {
        this.directFeedShow = true;
      }, 300);
      // setTimeout(()=>{
      //   this.router.navigate(['setting'], { replaceUrl: true })
      // },1000)
    }
  }

  giveDirectFeedback(type) {
    this.directFeedShow = false;
    if (type) {
      setTimeout(() => {
        this.directFeedback = true;
      }, 300);
    } else {
      this.submitRating(true);
      setTimeout(() => {
        this.router.navigate(["setting"], { replaceUrl: true });
      }, 1000);
    }
  }

  pushRating(index) {
    for (let i = 0; i <= 4; i++) {
      if (i <= index) {
        this.rating[i] = 1;
      } else {
        this.rating[i] = null;
      }
    }
  }

  submitRating(flag = false) {
    let rating = null;
    this.rating.map((ele) => {
      if (ele) {
        rating = rating + 1;
      }
    });
    if (
      (rating == null || !this.feedback) &&
      (this.giveRateShow || this.directFeedback) &&
      !flag
    ) {
      if (rating == null && this.giveRateShow) {
        this.global.showDangerToast(
          "",
          this.global.termsArray["err_please_rate"]
        );
        return;
      } else if (!this.feedback) {
        this.global.showDangerToast(
          "",
          this.global.termsArray["err_please_give_feedback"]
        );
        return;
      }
    }
    // else if(this.directFeedback && !this.feedback && !flag){
    //   this.global.showDangerToast(this.global.termsArray['err_please_give_reviews'])
    // }
    let body = {};
    body["like"] = this.like;
    if ((this.giveRateShow || this.directFeedback) && !flag) {
      body["rating"] = rating;
      body["feedback"] = this.feedback;
      body["public"] = this.like && this.feedback ? 1 : 0;
    }
    console.log(body);
    this.global.post(
      "rating",
      JSON.stringify(body),
      (data) => {
        if (data.success) {
          if (!flag) {
            this.global.showToast("", this.global.termsArray[data.message]);
            this.location.back();
          }
        } else {
          this.global.showDangerToast("", this.global.termsArray[data.message]);
        }
      },
      (err) => {},
      true
    );
  }

  getRating() {
    this.global.get(
      "getRatings",
      (data) => {
        if (data.success) {
          let response = data.data;
          console.log(response);
          this.like = response.like;
          if (response.like) {
            this.likeShow = false;
            this.feedback = response.feedback;
            if (!response.rating || response.rating == null) {
              this.feedBackShow = true;
            } else {
              this.global.showWarningToast(
                "",
                this.global.termsArray["msg_already_rated"]
              );
              if (response.rating) {
                this.giveRateShow = true;
              }
              this.alreadyRated = true;
              this.feedback = response.feedback;
              for (let i = 0; i <= 4; i++) {
                if (i < +response.rating) {
                  this.rating[i] = 1;
                } else {
                  this.rating[i] = null;
                }
              }
            }
          } else if (response.like == 0) {
            this.likeShow = true;
            this.alreadyRated = true;
            this.feedback = response.feedback;
            // for (let i = 0; i <= 4; i++) {
            //   if (i < +response.rating) {
            //     this.rating[i] = 1
            //   } else {
            //     this.rating[i] = null
            //   }
            // }
          } else {
            this.likeShow = true;
          }
        } else {
          this.global.showDangerToast(this.global.termsArray[data.message]);
        }
      },
      (err) => {},
      true
    );
  }
  goBack() {
    this.router.navigate(["setting"], { replaceUrl: true });
  }
}
