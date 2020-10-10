import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalService } from "../global.service";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { Title } from "@angular/platform-browser";
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
} from "../validator.service";
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
} from "angular-6-social-login";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  learningLanguages = [];
  formData;
  passwordsMatcher = new RepeatPasswordEStateMatcher();
  formSubmitAttempt = false;
  socialId: any = null;
  signUpType: any = "registration";
  constructor(
    private titleService: Title,
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    private socialAuthService: AuthService
  ) {
    let user2 = localStorage.getItem(btoa("user"))
      ? atob(localStorage.getItem(btoa("user")))
      : null;
    user2 = JSON.parse(user2);
    if (user2) {
      this.route.navigate(["user"], { replaceUrl: true });
    }
    this.getLearningLanguage();
    this.formData = this.formBuilder.group(
      {
        emailId: EmailValidation,
        password: new FormControl("", PasswordValidation),
        copassword: new FormControl("", PasswordValidation),
        surname: new FormControl("", Validators.required),
        name: new FormControl("", Validators.required),
        acceptTerms: new FormControl(false, Validators.pattern("true")),
        selectLanguage: new FormControl("", Validators.required),
        selectLanguageTerm: new FormControl(""),
        gender: new FormControl("", Validators.required),
      },
      { validator: RepeatPasswordValidator }
    );

    let user = localStorage.getItem(btoa("user"))
      ? atob(localStorage.getItem(btoa("user")))
      : null;
    user = JSON.parse(user);
    if (user) {
      this.route.navigate(["user"]);
    }
  }

  ngOnInit() {
    this.fbLibrary();
    this.formData.get("gender").setValue(0);

    if (
      this.global.routeParams &&
      this.global.routeParams["user"] &&
      this.global.routeParams["user"] != {}
    ) {
      let user = this.global.routeParams["user"];
      this.formData.get("emailId").setValue(user.email ? user.email : "");
      this.formData
        .get("name")
        .setValue(user.first_name ? user.first_name : "");
      this.formData
        .get("surname")
        .setValue(user.last_name ? user.last_name : "");
      if (
        this.global.routeParams &&
        this.global.routeParams.type &&
        this.global.routeParams.type == "fb"
      ) {
        this.signUpType = this.global.routeParams.type;
        this.socialId = user.id;
      }
      if (
        this.global.routeParams &&
        this.global.routeParams.type &&
        this.global.routeParams.type == "google"
      ) {
        this.signUpType = this.global.routeParams.type;
        this.socialId = user.id;
      }
    }
    console.log(this.formData);
  }

  getLearningLanguage() {
    this.global.get(
      "learningLanguages/" + this.global.selectLanguage,
      (data) => {
        this.global.learningLanguages = data.data.filter((ele) => {
          if (ele._id == this.global.learningLanguage) {
            this.formData.get("selectLanguageTerm").setValue(ele.termtext);
            this.formData.get("selectLanguage").setValue(ele._id);
          }
          return ele._id != this.global.selectLanguage;
        });
        console.log("learning_language", data);
      },
      (err) => {}
    );
  }

  selectLanguage(language) {
    console.log("language", language);
    this.global.learningLanguage = language._id;
    this.formData.get("selectLanguageTerm").setValue(language.termtext);
    this.formData.get("selectLanguage").setValue(language._id);
  }

  selectGender(gender) {
    this.formData.controls["gender"].value = gender;
    this.formData.value.gender = gender;
  }

  onClickSubmit(value) {
    if (value.selectLanguage == this.global.selectLanguage) {
      this.global.showDangerToast(
        this.global.termsArray["msg_choose_other_learning_language"]
      );
      return;
    }
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
    body["name"] = value.name;
    body["email"] = value.emailId.toLowerCase();
    body["password"] = value.password;
    body["learning_language_id"] = value.selectLanguage;
    body["language_id"] = this.global.selectLanguage;
    body["gender"] = value.gender;
    if (this.signUpType == "fb") {
      (body["isFacebook"] = 1), (body["facebook_id"] = this.socialId);
    }
    if (this.signUpType == "google") {
      (body["isGoogle"] = 1), (body["google_id"] = this.socialId);
    }
    this.global.post(
      "registration",
      body,
      (data) => {
        console.log(data);
        if (data.success) {
          this.global.showToast("", this.global.termsArray[data.message]);
          this.global.navigate(["verify"], {
            email: data.data.email,
            lastScreen: "registration",
          });
        } else {
          this.global.showDangerToast("", this.global.termsArray[data.message]);
          console.log(this.global.termsArray[data.message]);
        }
      },
      (err) => {
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  // social login

  public socialSignIn() {
    let socialPlatformProvider;

    socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    let user = {};
    this.socialAuthService.signIn(socialPlatformProvider).then((userData) => {
      console.log(" sign in data : ", userData);
      var names = userData["name"].split(" ");
      user["id"] = userData["id"];
      user["first_name"] = names[0];
      user["image"] = userData["image"];
      user["email"] = userData["email"];
      user["last_name"] = names.splice(1, names.length - 1).join(" ");
      this.loginWithGoogle(user);
    });
  }

  fbLibrary() {
    (window as any).fbAsyncInit = function () {
      window["FB"].init({
        appId: "434838987192361",
        cookie: true,
        xfbml: true,
        version: "v3.1",
      });
      window["FB"].AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  facebookLogin() {
    window["FB"].login(
      (response) => {
        console.log("login response", response);
        if (response.authResponse) {
          window["FB"].api(
            "/me",
            {
              fields: "last_name, first_name, email",
            },
            (userInfo) => {
              console.log("user information");
              console.log(userInfo);
              this.loginWithFacebook(userInfo);
            }
          );
        } else {
          console.log("User login failed");
        }
      },
      { scope: "email" }
    );
  }

  loginWithFacebook(user) {
    let body = {};
    body["facebook_id"] = user.id;
    body["language_id"] = this.global.selectLanguage;
    body["email"] = user.email ? user.email : "";
    body["surname"] = user.last_name ? user.last_name : "";
    body["name"] = user.first_name ? user.first_name : "";
    body["learning_language_id"] = "";

    this.global.post(
      "loginwithfacebook",
      JSON.stringify(body),
      (data) => {
        if (data.success) {
          this.global.showToast("", this.global.termsArray[data.message]);
          if (data.data.isCompleted === 0) {
            this.global.navigate(["register"], { user: user, type: "fb" });
            setTimeout(() => {
              location.reload();
            }, 300);
          } else {
            this.global.selectLanguage = data.data.language_id;
            localStorage.setItem(
              btoa("selectLanguage"),
              btoa(data.data.language_id)
            );
            this.global.learningLanguage = data.data.learning_language_id;
            this.global.getTermsData();
            if (data.data.status === 0) {
              this.global.navigate(["verify"], {
                email: data.data.email,
                lastScreen: "fb",
              });
            } else {
              this.global.loginTime = new Date();
              localStorage.setItem(
                btoa("user"),
                btoa(JSON.stringify(data.data))
              );
              localStorage.setItem("setupTime", this.global.setupTime + "");
              this.global.isLogin = true;
              localStorage.setItem(btoa("AuthToken"), btoa(data.data.token));
              this.global.AuthToken = data.data.token;
              this.global.user = data.data;
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
          }
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

  loginWithGoogle(user) {
    let body = {};
    body["google_id"] = user.id;
    body["language_id"] = this.global.selectLanguage;
    body["email"] = user.email ? user.email : "";
    body["surname"] = user.last_name ? user.last_name : "";
    body["name"] = user.first_name ? this.capitalize(user.first_name) : "";
    body["learning_language_id"] = "";

    this.global.post(
      "loginwithgoogle",
      JSON.stringify(body),
      (data) => {
        if (data.success) {
          this.global.showToast("", this.global.termsArray[data.message]);
          if (data.data.isCompleted === 0) {
            this.global.navigate(["register"], { user: user, type: "google" });
            setTimeout(() => {
              location.reload();
            }, 300);
          } else {
            this.global.selectLanguage = data.data.language_id;
            localStorage.setItem(
              btoa("selectLanguage"),
              btoa(data.data.language_id)
            );
            this.global.learningLanguage = data.data.learning_language_id;
            this.global.getTermsData();
            if (data.data.status === 0) {
              this.global.navigate(["verify"], {
                email: data.data.email,
                lastScreen: "google",
              });
            } else {
              this.global.loginTime = new Date();
              localStorage.setItem(
                btoa("user"),
                btoa(JSON.stringify(data.data))
              );
              localStorage.setItem("setupTime", this.global.setupTime + "");
              localStorage.setItem(btoa("AuthToken"), btoa(data.data.token));
              localStorage.setItem(
                btoa("selectLanguage"),
                btoa(data.data.language_id)
              );
              this.global.AuthToken = data.data.token;
              this.global.user = data.data;
              this.global.isLogin = true;
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
          }
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
  setPageTitle(title: string) {
    this.titleService.setTitle(title);
  }
  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
}
