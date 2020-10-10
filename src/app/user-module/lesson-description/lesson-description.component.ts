import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { GlobalService } from "../../global.service";
import { TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Router, ActivatedRoute } from "@angular/router";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { Location } from "@angular/common";

@Component({
  selector: "app-choose-lesson",
  templateUrl: "./lesson-description.component.html",
  styleUrls: ["./lesson-description.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LessonDescriptionComponent implements OnInit {
  @ViewChild(InfiniteScrollDirective, { static: true })
  infiniteScroll: InfiniteScrollDirective;

  set appScroll(directive: InfiniteScrollDirective) {
    this.infiniteScroll = directive;
  }

  Lfamily: any = localStorage.getItem(btoa("Lfamily"))
    ? localStorage.getItem(btoa("Lfamily"))
    : "";
  isSubscribed: any;
  page: any = 1;
  LessonList: any = {};
  listArray: any = [];
  status: any = "all";
  level: any = "all";
  loader = false;
  lessonFamilyId: any;
  totalCount: any;
  modalRef: BsModalRef;
  completeCount: any = 0;
  constructor(
    public global: GlobalService,
    public router: Router,
    private route: ActivatedRoute,
    public location: Location,
    private modalService: BsModalService
  ) {
    this.global.profileTab = 1;
    this.getSubsriptionStatus();
    this.route.paramMap.subscribe((params) => {
      this.lessonFamilyId = params.get("id") ? params.get("id") : null;
      console.log(params.get("id"));
    });
  }
  ngOnInit() {
    this.global.loader = true;
    setTimeout(() => {
      this.getLessonList();
    }, 500);
  }

  onScroll() {
    console.log("scroll");
    if (!this.global.loader) {
      this.getLessonList(this.page + 1);
      this.infiniteScroll.ngOnDestroy();
      this.infiniteScroll.setup();
    }
  }

  getLessonList(page = 1) {
    if (this.page == page && page != 1) {
      return;
    }
    let body = {};
    body["lessonfamily_id"] = this.lessonFamilyId;
    body["status"] = this.status;
    body["level"] = this.level;
    body["page"] = page;
    this.global.post(
      "lessonList",
      JSON.stringify(body),
      (data) => {
        if (data.success) {
          if (data.data.list == 0) {
            this.loader = true;
            this.page = page - 1;
          } else {
            this.page = page;
          }
          console.log(data);
          this.LessonList = data.data;
          this.listArray.push(...data.data.list);
        } else {
          this.global.showDangerToast(this.global.termsArray[data.message]);
          this.loader = true;
        }
      },
      (err) => {
        this.global.showDangerToast(err.message);
      },
      true
    );
  }
  getSubsriptionStatus() {
    this.global.get(
      "getSubsriptionStatus",
      (data) => {
        if (data.success) {
          this.isSubscribed = data.data.is_subsribed;
          // if (this.isSubscribed === 0) {
          //   this.global.showWarningToast(this.global.termsArray['msg_please_subscribe'])
          //   this.router.navigate(['account'])
          // }
        }
      },
      (err) => {},
      true
    );
  }

  navigate(lesson, template, i = 0) {
    if (this.isSubscribed || lesson.is_free) {
      localStorage.setItem(btoa("baselesson_id"), btoa(lesson.baselesson_id));
      localStorage.setItem(
        btoa("lessonfamily_id"),
        btoa(lesson.lessonfamily_id)
      );
      localStorage.setItem(btoa("lesson_id"), btoa(lesson._id));
      localStorage.setItem(btoa("lesson_title"), btoa(lesson.title + " "));
      localStorage.setItem(btoa("max_read_slide"), btoa(lesson.progress));
      localStorage.setItem(btoa("time_loop"), btoa(lesson.time_loop));
      this.global.baselesson_id = lesson.baselesson_id;
      this.global.lessonfamily_id = lesson.lessonfamily_id;
      this.global.lesson_id = lesson._id;
      this.global.lesson_title = lesson.title + " ";
      this.global.max_read_slide = lesson.progress;
      this.router.navigate(["lesson/" + "sentences"]);
    } else {
      this.openModal(template);
    }
  }

  openModal(template: TemplateRef<any>) {
    const config = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      class: "big-model-dialog",
    };
    this.modalRef = this.modalService.show(template, config);
  }

  navigateToSubscription() {
    // this.global.showWarningToast(this.global.termsArray['msg_please_subscribe'])
    this.router.navigate(["account"]);
  }

  returnLevel(level_id) {
    let level = "";
    if (level_id == 1) {
      level = "lbl_level_one";
    } else if (level_id == 2) {
      level = "lbl_level_two";
    } else if (level_id == 3) {
      level = "lbl_level_three";
    }
    return level;
  }

  filterLevel(level) {
    if (level != this.level) {
      this.level = level;
      this.LessonList = {};
      this.listArray = [];
      this.getLessonList();
    }
  }

  filterStatus(status) {
    if (status != this.status) {
      this.status = status;
      this.LessonList = {};
      this.listArray = [];
      this.getLessonList();
    }
  }
}
