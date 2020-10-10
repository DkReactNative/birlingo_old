import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GlobalService } from "../global.service";
import { Router } from "@angular/router";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { EmailValidation } from "../validator.service";
@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.sass"]
})
export class ForgotPasswordComponent implements OnInit {
  formSubmitAttempt = false;
  formData;

  constructor(
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder
  ) {
    this.formData = this.formBuilder.group({
      email: EmailValidation
    });
    let user = localStorage.getItem(btoa("user")) ? atob(localStorage.getItem(btoa("user"))) : null;
    user = JSON.parse(user);
    if (user) {
      this.route.navigate(["user"],{replaceUrl:true});
    }
  }

  ngOnInit() { }

  submit(value) {
    this.formSubmitAttempt = true;
    if (!this.formData.valid) {
      console.log(this.formData);
      return;
    } else {
      let body = {};
      body["email"] = value.email.toLowerCase();
      body["password"] = value.password;
      this.global.post(
        "forgotpassword",
        body,
        data => {
          console.log(data);
          if (data.success) {
            this.global.user = data.data;
            this.global.showToast("", this.global.termsArray[data.message]);
            this.global.navigate(["verify"], {
              email: data.data.email,
              lastScreen: "forgot"
            });
          } else {
            this.global.showDangerToast(
              "",
              this.global.termsArray[data.message]
            );
          }
        },
        err => {
          this.global.showDangerToast("", err.message);
        },
        true
      );
    }
  }
}
