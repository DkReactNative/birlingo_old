import { Location } from "@angular/common";
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  HostListener,
} from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import * as moment from "moment";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
declare var $: any;

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit {
  couponCode;
  couponCodeId;
  couponCodeData;

  planAlreadyPurchased: any = false;
  selectedPlanID: any;
  subscribedId: any = null;
  selectPlanData: any;
  subscriptionList: any;
  modalRef: BsModalRef;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  message: string;
  isSubscribed: any;
  constructor(
    private location: Location,
    public global: GlobalService,
    private ngxService: NgxUiLoaderService,
    private modalService: BsModalService,
    public router: Router
  ) {
    this.global.profileTab = 2;
    this.getSubsriptionStatus();
    this.getSubscriptionData();
  }

  ngOnInit() {}

  openCheckout(couponApplied = false, couponCodeData = {}) {
    var price;
    if (couponApplied && couponCodeData["discount_less"]) {
      price = couponCodeData["discount_less"];
    } else {
      price = this.selectPlanData.price * this.selectPlanData.validity;
    }
    this.global.loader = true;
    this.ngxService.start();
    var handler = (<any>window).StripeCheckout.configure({
      key: "pk_test_yeDUSYdnGyptw6mK9M0uaCwB00erW2vMa1",
      locale: "auto",
      currency: "eur",
      closed: () => {
        this.global.loader = false;
        this.ngxService.stop();
      },
      panelLabel: this.global.termsArray["lbl_subscription_pay"]
        ? this.global.termsArray["lbl_subscription_pay"]
        : "Pay",
      token: (token: any) => {
        this.global.loader = false;
        console.log(token);
        this.purchaseSubscription(token.id, couponApplied, couponCodeData);
      },
    });
    handler.open({
      image: "https://stripe.com/img/documentation/checkout/marketplace.png",
      name: "Birlingo",
      amount: 100 * price,
      allowRememberMe: false,
      description: `${
        this.global.termsArray["lbl_subscription_amount"]
      } € ${price.toFixed(2)}`,
      email: this.global.user.email,
    });
  }

  getToken() {
    this.message = "Loading...";

    (<any>window).Stripe.card.createToken(
      {
        number: this.cardNumber,
        exp_month: this.expiryMonth,
        exp_year: this.expiryYear,
        cvc: this.cvc,
      },
      (status: number, response: any) => {
        if (status === 200) {
          this.message = `Success! Card token ${response.card.id}.`;
        } else {
          this.message = response.error.message;
        }
      }
    );
  }

  purchaseSubscription(token, couponApplied = false, couponCodeData = {}) {
    let body = {};
    body["stripeToken"] = token;
    body["user_id"] = this.global.user._id;
    body["subscription_id"] = this.selectedPlanID;
    body["payment_type"] = "stripe";
    if (couponApplied && couponCodeData["coupon"])
      body["coupon"] = couponCodeData["coupon"];
    body["stripe_id"] = this.selectPlanData.stripe_id;
    body["amount"] = this.selectPlanData.price * this.selectPlanData.validity;
    this.global.post(
      "subscribed",
      JSON.stringify(body),
      (data) => {
        console.log(data);
        if (data.success) {
          this.global.showToast(this.global.termsArray[data.message]);
          this.getSubsriptionStatus();
          this.getSubscriptionData();
          this.router.navigate(["user"], { replaceUrl: true });
        } else {
          this.global.showDangerToast(
            "Error",
            this.global.termsArray[data.message]
          );
        }
      },
      (err) => {
        this.global.showDangerToast("Error", err.message);
      },
      true
    );
  }
  getSubscriptionData() {
    let body = {};
    body["language_id"] = this.global.selectLanguage;
    body["user_id"] = this.global.user._id;
    this.global.post(
      "subscriptions",
      JSON.stringify(body),
      (data) => {
        console.log(data);
        if (data.success) {
          this.subscriptionList = data.data.map((ele) => {
            return ele;
          });
        } else {
          this.global.showDangerToast(
            "Error",
            this.global.languageArray[data.message]
          );
        }
      },
      (err) => {
        this.global.showDangerToast("Error", err.message);
      },
      true
    );
  }

  cancelSubscription(id) {
    if (!id) {
      return;
    }
    let body = {};
    body["subscribed_id"] = id;
    this.global.post(
      "cancelSubs",
      JSON.stringify(body),
      (data) => {
        console.log(data);
        if (data.success) {
          this.getSubscriptionData();
          this.global.showToast(this.global.termsArray[data.message]);
        } else {
          this.global.showDangerToast(
            "Error",
            this.global.languageArray[data.message]
          );
        }
      },
      (err) => {
        this.global.showDangerToast("Error", err.message);
      },
      true
    );
  }

  applyCouponCode(coupon) {
    if (!coupon) {
      return;
    }
    let body = {};
    body["code"] = coupon;
    body["subscription_id"] = this.selectedPlanID;
    this.global.post(
      "apply-coupon",
      JSON.stringify(body),
      (data) => {
        console.log(data);
        if (data.success) {
          this.couponCodeId = data.data;
          this.couponCode = "";
          this.modalRef.hide();
          $("#open-modal").trigger("click");
          this.couponCodeData = data.data;
          this.global.showToast(this.global.termsArray[data.message]);
        } else {
          this.couponCode = "";
          this.global.showDangerToast(
            "Error",
            this.global.termsArray[data.message]
          );
        }
      },
      (err) => {
        this.couponCode = "";
        this.modalRef.hide();
        this.global.showDangerToast("Error", err.message);
      },
      true
    );
  }

  choosePlan(subscription) {
    this.subscribedId = null;
    this.selectPlanData = subscription;
    this.selectedPlanID = subscription._id;

    if (subscription.status == 1) {
      this.planAlreadyPurchased = true;
      this.subscribedId = subscription.subscribed_id;
    } else {
      this.planAlreadyPurchased = false;
    }
  }

  updatePlan(couponApplied = false, couponCodeData = {}) {
    this.couponCode = "";
    if (this.selectedPlanID == null || this.selectedPlanID == "") {
      alert(this.global.termsArray["msg_subs_select_plan"]);
      return;
    } else if (this.planAlreadyPurchased) {
      alert(this.global.termsArray["lbl_already_selected"]);
      return;
    }
    this.openCheckout(couponApplied, couponCodeData);
  }
  getSubsriptionStatus() {
    this.global.get(
      "getSubsriptionStatus",
      (data) => {
        if (data.success) {
          this.isSubscribed = data.data.is_subsribed;
        }
      },
      (err) => {},
      true
    );
  }
  openModal(template: TemplateRef<any>, data = "big-model-dialog") {
    const config = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      class: data,
    };
    this.modalRef = this.modalService.show(template, config);
  }
  goBack() {
    this.router.navigate(["setting"], { replaceUrl: true });
  }
  transform(date: any, args?: any): any {
    return moment(moment(date)).format("DD.MM.YYYY");
  }
}
