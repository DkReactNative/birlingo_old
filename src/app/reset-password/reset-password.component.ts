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
import {
  PasswordValidation,
  RepeatPasswordValidator
} from "../validator.service";
import { Location } from '@angular/common';

@Component({
  selector: "app-reset",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.sass"]
})
export class ResetPasswordComponent implements OnInit {
  email = null;
  formSubmitAttempt = false;
  formData;

  constructor(
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder, public location: Location
  ) {
    this.formData = this.formBuilder.group(
      {
        password: new FormControl("", PasswordValidation),
        copassword: new FormControl("", PasswordValidation)
      },
      { validator: RepeatPasswordValidator }
    );
    let user = localStorage.getItem(btoa("user")) ? atob(localStorage.getItem(btoa("user"))) : null;
    user = JSON.parse(user);
    if (user) {
      this.route.navigate(["user"],{replaceUrl:true});
    }
    if (this.global.routeParams &&
      this.global.routeParams["email"] &&
      this.global.routeParams["email"] != {}
    ) {
      this.email = this.global.routeParams["email"];
    } else {
      this.route.navigate(["/"],{replaceUrl:true});
    }
  }

  ngOnInit() {
    console.log(this.global.routeParams);

  }

  submit(value) {
    this.formSubmitAttempt = true;
    if (!this.formData.valid) {
      console.log(this.formData);
      return;
    } else {
      let body = {};
      body["email"] = this.email;
      body["password"] = value.password;
      body["confirm_password"] = value.copassword;
      this.global.post(
        "resetpassword",
        body,
        data => {
          console.log(data);
          if (data.success) {
            this.global.showToast("", this.global.termsArray[data.message]);
            this.route.navigate(["login"]);
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
