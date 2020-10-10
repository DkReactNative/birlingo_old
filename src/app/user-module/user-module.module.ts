import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DeviceDetectorModule } from "ngx-device-detector";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./user.component";
import { AppRoutingModule } from "./app-routing.module";
import { ChooseLessonComponent } from "./choose-lesson/choose-lesson.component";
import { LessonDescriptionComponent } from "./lesson-description/lesson-description.component";
import { UserSettingComponent } from "./user-setting/user-setting.component";
import { ProfileComponent } from "./profile/profile.component";
import { ChooseLanguageComponent } from "./choose-language/choose-language.component";
import { TermsComponent } from "./terms/terms.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { RateComponent } from "./rate/rate.component";
import { DownloadsComponent } from "./downloads/downloads.component";
import { DownloadDescriptionComponent } from "./download-description/download-description.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LessonComponent } from "./lesson/lesson.component";
import {
  MatButtonModule,
  MatListModule,
  MatSliderModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
} from "@angular/material";
import { NgCircleProgressModule } from "ng-circle-progress";
import { SupportComponent } from "./support/support.component";
import { NoDataFoundComponent } from "./no-data-found/no-data-found.component";
import { ChangeLanguageComponent } from "./change-language/change-language.component";
import { CounterDirective } from "../counter.directive";
import { AccountComponent } from "./account/account.component";
import { ProgressBarModule } from "angular-progress-bar";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { SusbscriptionComponent } from "./susbscription/susbscription.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgOtpInputModule } from "ng-otp-input";
import {
  NgxUiLoaderConfig,
  NgxUiLoaderModule,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";
const modules = [
  MatButtonModule,
  MatListModule,
  MatSliderModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  NgOtpInputModule,
  NgxUiLoaderModule,
];
@NgModule({
  declarations: [
    AppComponent,
    ChooseLessonComponent,
    LessonDescriptionComponent,
    UserSettingComponent,
    ProfileComponent,
    ChooseLanguageComponent,
    TermsComponent,
    PrivacyComponent,
    RateComponent,
    DownloadsComponent,
    DownloadDescriptionComponent,
    LessonComponent,
    SupportComponent,
    NoDataFoundComponent,
    ChangeLanguageComponent,
    CounterDirective,
    AccountComponent,
    ChangePasswordComponent,
    SusbscriptionComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    modules,
    DeviceDetectorModule,
    ProgressBarModule,
    InfiniteScrollModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      imageSrc: "assets/images/play.svg",
    }),
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent],
})
export class UserModuleModule {}
