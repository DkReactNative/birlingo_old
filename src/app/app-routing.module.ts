import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { PolicyComponent } from "./policy/policy.component";
import { ImprintComponent } from "./imprint/imprint.component";
import { MethodComponent } from "./method/method.component";
import { AgbComponent } from "./agb/agb.component";
import { ContactComponent } from "./contact/contact.component";
import { BlogComponent } from "./blog/blog.component";
import { LoginComponent } from "./login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { BlogdetailComponent } from "./blogdetail/blogdetail.component";
import { RegisterComponent } from "./register/register.component";
import { OtpVerifyComponent } from "./otp-verify/otp-verify.component";
import { Auth2Service } from "./auth2.service";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { TermsConditionComponent } from "./terms-condition/terms-condition.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { SupportComponent } from "./support/support.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { PreloadAllModules } from "@angular/router";

// add this in each object for authentication  ,canActivate: [AuthService]

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "privacy-policy",
    component: PolicyComponent,
  },
  {
    path: "privacy-policy/:id",
    component: PolicyComponent,
  },
  {
    path: "term-condition",
    component: TermsConditionComponent,
  },
  {
    path: "term-condition/:id",
    component: TermsConditionComponent,
  },
  {
    path: "about-us",
    component: AboutUsComponent,
  },
  {
    path: "about-us/:id",
    component: AboutUsComponent,
  },
  {
    path: "agb",
    component: AgbComponent,
  },
  {
    path: "agb/:id",
    component: AgbComponent,
  },
  {
    path: "support/:id",
    component: SupportComponent,
  },
  {
    path: "imprint",
    component: ImprintComponent,
  },
  {
    path: "imprint/:id",
    component: ImprintComponent,
  },
  {
    path: "method",
    component: MethodComponent,
  },
  {
    path: "reviews",
    component: ReviewsComponent,
  },
  {
    path: "agb",
    component: AgbComponent,
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: "contact/:id",
    component: ContactComponent,
  },
  {
    path: "blog",
    component: BlogComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "verify",
    component: OtpVerifyComponent,
  },
  {
    path: "forgot",
    component: ForgotPasswordComponent,
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
  },
  {
    path: "blog-detail/:id",
    component: BlogdetailComponent,
  },
  {
    path: "page-not-found",
    component: NotFoundComponent,
  },
  {
    path: "user",
    redirectTo: "/choose-lesson",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "page-not-found",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
