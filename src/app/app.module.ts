import { BrowserModule, DomSanitizer, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, ɵ_sanitizeStyle } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
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
import { HttpClientModule } from "@angular/common/http";
import { GlobalService } from "./global.service";
import { RegisterComponent } from "./register/register.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OtpVerifyComponent } from "./otp-verify/otp-verify.component";
import { ToastrModule } from "ngx-toastr";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { AuthService } from "./auth.service";
import { Auth2Service } from "./auth2.service";
import { UserModuleModule } from "./user-module/user-module.module";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { TermsConditionComponent } from "./terms-condition/terms-condition.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { SupportComponent } from "./support/support.component";
import { ModalModule, BsModalRef } from "ngx-bootstrap/modal";
import {
  MatButtonModule,
  MatListModule,
  MatSliderModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
} from "@angular/material";
import { NgOtpInputModule } from "ng-otp-input";
import { AudioService } from "./audio.service";
import { environment } from "./../environments/environment";
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular-6-social-login";
import { NoDataFoundComponent } from "./no-data-found/no-data-found.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import {
  NgxUiLoaderConfig,
  NgxUiLoaderModule,
  NgxUiLoaderService,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";
import {
  DeviceDetectorModule,
  DeviceDetectorService,
} from "ngx-device-detector";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "red",
  fgsColor: "white",
  pbColor: "#ffffff",
  bgsPosition: POSITION.centerCenter,
  bgsSize: 40,
  bgsType: SPINNER.ballSpinClockwise, // background spinner type
  fgsType: SPINNER.threeBounce, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};

const appRoutes: Routes = [];
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        "105221082816-0ai54u4jpst6bln9hd7uqjpntejr1ba6.apps.googleusercontent.com"
      ),
    },
  ]);
  return config;
}
const modules = [
  MatButtonModule,
  MatListModule,
  MatSliderModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  NgOtpInputModule,
  NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  DeviceDetectorModule,
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PolicyComponent,
    ImprintComponent,
    MethodComponent,
    AgbComponent,
    ContactComponent,
    BlogComponent,
    LoginComponent,
    NotFoundComponent,
    BlogdetailComponent,
    RegisterComponent,
    OtpVerifyComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TermsConditionComponent,
    AboutUsComponent,
    SupportComponent,
    NoDataFoundComponent,
    ReviewsComponent,
  ],
  imports: [
    //NgcCookieConsentModule.forRoot(cookieConfig),
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    modules,
    UserModuleModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    SocialLoginModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: "enabled",
    }),
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      maxOpened: 1,
    }),
    ModalModule.forRoot(),
  ],
  providers: [
    GlobalService,
    NgxUiLoaderService,
    BsModalRef,
    NgxNavigationWithDataComponent,
    AuthService,
    Auth2Service,
    AudioService,
    DeviceDetectorService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
