import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalService } from "../global.service";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { Location } from "@angular/common";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
declare var $: any;
@Component({
  selector: "app-otp-verify",
  templateUrl: "./otp-verify.component.html",
  styleUrls: ["./otp-verify.component.scss"],
})
export class OtpVerifyComponent implements OnInit {
  // @ViewChild("input1", { static: true }) input1: ElementRef;
  // @ViewChild("input2", { static: true }) input2: ElementRef;
  // @ViewChild("input3", { static: true }) input3: ElementRef;
  // @ViewChild("input4", { static: true }) input4: ElementRef;
  // @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  formData;
  disabledBtn: any = 0;
  input;
  otp;
  email = null;
  lastScreen = null;
  formSubmitAttempt = false;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
    inputClass: "form-control",
    containerClass: "container-style",
    inputStyles: {},
  };

  constructor(
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    public location: Location
  ) {
    this.formData = this.formBuilder.group({
      otp: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern("^[0-9]{4}"),
      ]),
    });
    this.input = new Array(4);
    let user = localStorage.getItem(btoa("user"))
      ? atob(localStorage.getItem(btoa("user")))
      : null;
    user = JSON.parse(user);
    if (user) {
      this.route.navigate(["user"], { replaceUrl: true });
    }
    if (
      this.global.routeParams &&
      this.global.routeParams["email"] &&
      this.global.routeParams["lastScreen"]
    ) {
      this.email = this.global.routeParams["email"];
      this.lastScreen = this.global.routeParams["lastScreen"];
    } else {
      this.route.navigate([""], { replaceUrl: true });
    }
  }

  ngOnInit() {
    // this.formData.get("otp").valueChanges.subscribe((otp) => {
    //   console.log(otp);
    //   this.formData.get("otp").setValue(otp.replace(/[^0-9]+/g, ""));
    // });
  }

  // getCodeBoxElement(index) {
  //   switch (index) {
  //     case 1:
  //       return this.input1.nativeElement;
  //     case 2:
  //       return this.input2.nativeElement;
  //     case 3:
  //       return this.input3.nativeElement;
  //     case 4:
  //       return this.input4.nativeElement;
  //     default:
  //       return null;
  //   }
  // }

  // keypress(event) {
  //   const eventCode = event.which || event.keyCode;
  //   if (
  //     (eventCode != 46 &&
  //       eventCode > 31 &&
  //       (eventCode < 48 || eventCode > 57) &&
  //       eventCode < 96) ||
  //     eventCode > 105
  //   ) {
  //     event.preventDefault();
  //   }
  // }

  // onKeyUpEvent(event, index) {
  //   console.log(event);
  //   const eventCode = event.which || event.keyCode;
  //   if (
  //     eventCode != 46 &&
  //     eventCode > 31 &&
  //     (eventCode < 48 || eventCode > 57) &&
  //     (eventCode < 96 || eventCode > 105)
  //   ) {
  //   } else {
  //     if (this.getCodeBoxElement(index).value.length === 1) {
  //       if (index !== 4) {
  //         this.getCodeBoxElement(index + 1).focus();
  //       } else {
  //         this.getCodeBoxElement(index).blur();
  //         this.verifyOtp();
  //         console.log("submit code ");
  //       }
  //     }
  //     if (eventCode === 8 && index !== 1) {
  //       this.getCodeBoxElement(index - 1).focus();
  //     }
  //   }
  // }

  // onFocusEvent(index) {
  //   for (let item = 1; item < index; item++) {
  //     const currentElement = this.getCodeBoxElement(item);
  //     if (!currentElement.value) {
  //       currentElement.focus();
  //       break;
  //     }
  //   }
  // }

  verifyOtp(formdata) {
    if (this.disabledBtn) {
      return;
    }
    this.disabledBtn = 1;
    this.formSubmitAttempt = true;
    if (!this.formData.valid) {
      console.log(this.formData);
      this.disabledBtn = 0;
      return;
    } else {
      let body = {};
      // body["otp"] = +this.input.join("");
      body["otp"] = +formdata.otp;
      body["email"] = this.email;
      this.global.post(
        "verifyOtp",
        body,
        (data) => {
          this.disabledBtn = 0;
          console.log(data);
          if (data.statuscode === 400) {
            this.formSubmitAttempt = false;
            // this.input = [];
            // this.input = new Array(4);
            this.formData.get("otp").setValue("");
            this.global.showDangerToast(this.global.termsArray[data.message]);
          } else {
            if (data.success) {
              this.global.selectLanguage = data.data.language_id;
              this.global.setCurrentUserInterval();
              localStorage.setItem(
                btoa("selectLanguage"),
                btoa(data.data.language_id)
              );
              this.global.learningLanguage = data.data.learning_language_id;
              this.global.getTermsData();
              if (this.lastScreen === "registration") {
                this.global.loginTime = new Date();
                localStorage.setItem(
                  btoa("user"),
                  btoa(JSON.stringify(data.data))
                );
                localStorage.setItem("setupTime", this.global.setupTime + "");
                this.global.user = data.data;
                this.global.isLogin = true;
                this.global.AuthToken = data.data.token;
                localStorage.setItem(btoa("AuthToken"), btoa(data.data.token));
                this.global.showToast("", this.global.termsArray[data.message]);
                if (data.data.first_time) {
                  // for navigate to demo when user move to app first time

                  localStorage.setItem(
                    btoa("lesson_id"),
                    btoa(data.data.lesson_id)
                  );
                  this.global.max_read_slide = 0;
                  this.global.lesson_id = data.data.lesson_id;
                  this.route.navigate(["lesson/" + "demo"], {
                    replaceUrl: true,
                  });
                } else {
                  this.route.navigate(["user"], { replaceUrl: true });
                }
              } else if (this.lastScreen === "forgot") {
                this.global.showToast("", this.global.termsArray[data.message]);
                this.global.navigate(["reset-password"], {
                  email: data.data.email,
                });
              } else if (this.lastScreen === "fb") {
                this.global.loginTime = new Date();
                localStorage.setItem(
                  btoa("user"),
                  btoa(JSON.stringify(data.data))
                );
                localStorage.setItem("setupTime", this.global.setupTime + "");
                this.global.user = data.data;
                this.global.isLogin = true;
                localStorage.setItem(btoa("AuthToken"), btoa(data.data.token));
                this.global.AuthToken = data.data.token;
                if (data.data.first_time) {
                  // for navigate to demo when user move to app first time

                  localStorage.setItem(
                    btoa("lesson_id"),
                    btoa(data.data.lesson_id)
                  );
                  this.global.max_read_slide = 0;
                  this.global.lesson_id = data.data.lesson_id;
                  this.route.navigate(["lesson/" + "demo"]);
                } else {
                  this.route.navigate(["user"]);
                }
              } else if (this.lastScreen === "google") {
                this.global.loginTime = new Date();
                localStorage.setItem(
                  btoa("user"),
                  btoa(JSON.stringify(data.data))
                );
                localStorage.setItem("setupTime", this.global.setupTime + "");
                this.global.user = data.data;
                this.global.isLogin = true;
                localStorage.setItem(btoa("AuthToken"), btoa(data.data.token));
                this.global.AuthToken = data.data.token;
                if (data.data.first_time) {
                  // for navigate to demo when user move to app first time

                  localStorage.setItem(
                    btoa("lesson_id"),
                    btoa(data.data.lesson_id)
                  );
                  this.global.max_read_slide = 0;
                  this.global.lesson_id = data.data.lesson_id;
                  this.route.navigate(["lesson/" + "demo"]);
                } else {
                  this.route.navigate(["user"]);
                }
              } else if (this.lastScreen === "login") {
                this.global.loginTime = new Date();
                localStorage.setItem(
                  btoa("user"),
                  btoa(JSON.stringify(data.data))
                );
                localStorage.setItem("setupTime", this.global.setupTime + "");
                this.global.user = data.data;
                this.global.isLogin = true;
                localStorage.setItem(btoa("AuthToken"), btoa(data.data.token));
                this.global.AuthToken = data.data.token;
                if (data.data.first_time) {
                  // for navigate to demo when user move to app first time

                  localStorage.setItem(
                    btoa("lesson_id"),
                    btoa(data.data.lesson_id)
                  );
                  this.global.max_read_slide = 0;
                  this.global.lesson_id = data.data.lesson_id;
                  this.route.navigate(["lesson/" + "demo"]);
                } else {
                  this.route.navigate(["user"]);
                }
              }
            } else {
              this.formSubmitAttempt = false;
              this.input = [];
              this.input = new Array(4);
              this.global.showDangerToast(
                "",
                this.global.termsArray[data.message]
              );
              // this.input1.nativeElement.focus();
            }
          }
        },
        (err) => {
          this.disabledBtn = 0;
          // this.input = [];
          // this.input = new Array(4);
          this.formData.get("otp").setValue("");
          this.global.showDangerToast("", err.message);
        },
        true
      );
    }
  }

  resendOtp() {
    this.formSubmitAttempt = false;
    let body = {};
    body["email"] = this.email;
    this.global.post(
      "resendotp",
      body,
      (data) => {
        console.log(data);
        if (data.statuscode === 400) {
          this.global.showDangerToast(this.global.termsArray[data.message]);
        } else {
          if (data.success) {
            this.global.showToast("", this.global.termsArray[data.message]);
            this.input = [];
            this.input = new Array(4);
          } else {
            this.global.showDangerToast(
              "",
              this.global.termsArray[data.message]
            );
          }
        }
      },
      (err) => {
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }
  onOtpChange(otp) {
    this.otp = otp;
  }
}
