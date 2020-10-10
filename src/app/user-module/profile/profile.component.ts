import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalService } from "../../global.service";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import {
  EmailValidation,
  PasswordValidation,
  RepeatPasswordEStateMatcher,
  RepeatPasswordValidator,
} from "../../validator.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
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
      email: EmailValidation,
      surname: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      gender: new FormControl(""),
    });
    this.getProfileData();
    this.global.profileTab = 2;
  }

  ngOnInit() {}

  selectGender(gender) {
    this.formData.controls["gender"].value = gender;
    this.formData.value.gender = gender;
  }
  getProfileData() {
    this.global.get(
      "getManageAccount/" + this.global.user._id,
      (data) => {
        console.log(data);
        if (data.success) {
          let user = data.data.user_info;
          this.formData.get("email").setValue(user.email);
          this.formData.get("name").setValue(user.name);
          this.formData.get("surname").setValue(user.surname);
          this.formData.get("gender").setValue(user.gender);
        } else {
          this.global.showDangerToast("", this.global.termsArray[data.message]);
        }
      },
      (err) => {
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

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
    body["surname"] = value.surname;
    body["name"] = this.capitalize(value.name);
    body["user_id"] = this.global.user._id;
    body["gender"] = value.gender;
    this.global.post(
      "updateManageAccount",
      body,
      (data) => {
        if (data.success) {
          this.global.user = data.data.user;
          localStorage.setItem(
            btoa("user"),
            btoa(JSON.stringify(data.data.user))
          );
          this.global.showToast("", this.global.termsArray[data.message]);
          // this.route.navigate(["setting"]);
        } else {
          this.global.showDangerToast("", this.global.termsArray[data.message]);
        }
      },
      (err) => {
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }
  removeEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.replace(regex, "");
  }

  goBack() {
    this.route.navigate(["setting"], { replaceUrl: true });
  }
  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
}
