import { Location } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalService } from "../../global.service";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import {
  EmailValidation,
  PasswordValidation,
  RepeatPasswordEStateMatcher,
  RepeatPasswordValidator
} from "../../validator.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit {
  formData;
  passwordsMatcher = new RepeatPasswordEStateMatcher();
  formSubmitAttempt = false;
  constructor(
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    public location: Location
  ) {
    this.formData = this.formBuilder.group({
      oldpassword: new FormControl("", Validators.required),
      password: new FormControl("", PasswordValidation),
      copassword: new FormControl("", PasswordValidation),
    },
      { validator: RepeatPasswordValidator });

    this.global.profileTab = 2

    if (this.global.user.login_with_social == 1) {
      this.route.navigate['user']
    }

  }

  ngOnInit() { }



  onClickSubmit(value) {
    // this.formData.get("name").setValue(this.removeEmojis(value.name));
    // this.formData.get("surname").setValue(this.removeEmojis(value.surname));
    this.formSubmitAttempt = true;
    if (!this.formData.valid) {
      console.log(this.formData);
      return;
    } else {
      console.log(this.formData);
      this.callRegisterApi(value);
    }
  }

  callRegisterApi(value) {
    let body = {};
    body["old_password"] = value.oldpassword;
    body["new_password"] = value.password;
    body["user_id"] = this.global.user._id;
    this.global.post(
      "changepassword",
      body,
      data => {
        if (data.success) {
          this.global.showToast("", this.global.termsArray[data.message]);
          this.location.back()
          // this.route.navigate(["setting"]);
        } else {
          this.global.showDangerToast("", this.global.termsArray[data.message]);
        }
      },
      err => {
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }
  goBack(){
    this.route.navigate(['setting'], { replaceUrl: true })
  }

}

