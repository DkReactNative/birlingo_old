import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { GlobalService } from '../global.service';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.sass"]
})
export class FooterComponent implements OnInit {
  copyRight: any
  constructor(private router: Router, private titleService: Title, public global: GlobalService) {
    this.getCopyRight()
  }

  ngOnInit() { }

  setPageTitle(title: string) {
    this.titleService.setTitle(title);
  }
  getCopyRight() {
    this.global.get(
      "getSettingData",
      data => {
        this.copyRight = data.data.copyright
      },
      err => { }
    );
  }
}
