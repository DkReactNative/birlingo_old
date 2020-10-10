import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { TemplateRef } from "@angular/core";

@Component({
  selector: "app-choose-lesson",
  templateUrl: "./choose-lesson.component.html",
  styleUrls: ["./choose-lesson.component.scss"],
})
export class ChooseLessonComponent implements OnInit {
  LessonFamily: any;
  isSubscribed: any;
  modalRef: BsModalRef;
  completeCount: any = 0;
  totalCount: any = 0;
  constructor(
    public global: GlobalService,
    public router: Router,
    private modalService: BsModalService
  ) {
    global.setCurrentUserInterval();
    this.global.profileTab = 1;
    localStorage.removeItem(btoa("routeParams"));
    this.global.routeParams = null;
    this.getSubsriptionStatus();
  }
  ngOnInit() {
    this.global.loader = true;
    setTimeout(() => {
      this.getLessonFamily();
    }, 500);
  }
  navigate(type, data, progress = null) {
    if (type == "sentences") {
      // if (this.isSubscribed) {
      this.router.navigate(["lesson-description/" + data._id]);
      localStorage.setItem(btoa("Lfamily"), data.Lfamily);
      // }
      // else {
      //   this.global.showWarningToast(this.global.termsArray['msg_please_subscribe'])
      //   this.router.navigate(['account'])
      // }
    } else {
      if (data.lesson_id) {
        localStorage.setItem(btoa("lesson_id"), btoa(data.lesson_id));
        this.global.lesson_id = data.lesson_id;
      }

      localStorage.setItem(
        btoa("max_read_slide"),
        btoa(data.levels[0].progres)
      );
      localStorage.setItem(btoa("time_loop"), btoa(data.levels[0].time_loop));

      this.global.max_read_slide = data.levels[0].progres;

      this.router.navigate(["lesson/" + type]);
    }
  }
  getLessonFamily() {
    let body = {};
    body["language_id"] = this.global.selectLanguage;
    body["user_id"] = this.global.user._id;
    this.global.post(
      "lesson-family",
      JSON.stringify(body),
      (data) => {
        if (data.success) {
          console.log(data);
          this.LessonFamily = data.data;
          this.totalCount =
            data.data.family.length > 0 ? data.data.family.length : 1;
          data.data.family.map((ele) => {
            if (ele.progress >= 100) {
              this.completeCount++;
            }
          });
        } else {
          this.global.showDangerToast(this.global.termsArray[data.message]);
        }
      },
      (err) => {
        this.global.showDangerToast(err.message);
      },
      true,
      2000
    );
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getSubsriptionStatus() {
    this.global.get(
      "getSubsriptionStatus",
      (data) => {
        if (data.success) {
          this.isSubscribed = data.data.is_subsribed;
        }
      },
      (err) => {},
      true
    );
  }
}
