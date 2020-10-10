import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
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
import { AuthService } from "../auth.service";
import { LessonComponent } from "./lesson/lesson.component";
import { SupportComponent } from "./support/support.component";
import { ChangeLanguageComponent } from "./change-language/change-language.component";
import { AccountComponent } from "./account/account.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { SusbscriptionComponent } from "./susbscription/susbscription.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "choose-lesson",
    component: ChooseLessonComponent,
    canActivate: [AuthService],
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [AuthService],
  },
  {
    path: "account",
    component: AccountComponent,
    canActivate: [AuthService],
  },
  {
    path: "lesson-description/:id",
    component: LessonDescriptionComponent,
    canActivate: [AuthService],
  },
  {
    path: "setting",
    component: UserSettingComponent,
    canActivate: [AuthService],
  },
  { path: "profile", component: ProfileComponent, canActivate: [AuthService] },
  {
    path: "choose-learning-language",
    component: ChooseLanguageComponent,
    canActivate: [AuthService],
  },
  {
    path: "choose-app-language",
    component: ChangeLanguageComponent,
    canActivate: [AuthService],
  },
  { path: "terms-use", component: TermsComponent, canActivate: [AuthService] },
  { path: "privacy", component: PrivacyComponent, canActivate: [AuthService] },
  { path: "rating", component: RateComponent, canActivate: [AuthService] },
  {
    path: "downloads",
    component: DownloadsComponent,
    canActivate: [AuthService],
  },
  {
    path: "download-description",
    component: DownloadDescriptionComponent,
    canActivate: [AuthService],
  },
  {
    path: "lesson/:id",
    component: LessonComponent,
    canActivate: [AuthService],
  },
  {
    path: "lesson",
    redirectTo: "choose-lesson",
    pathMatch: "full",
    canActivate: [AuthService],
  },
  {
    path: "support",
    component: SupportComponent,
    canActivate: [AuthService],
  },
  {
    path: "subscription",
    component: SusbscriptionComponent,
    canActivate: [AuthService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
