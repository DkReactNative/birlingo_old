import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { GlobalService } from '../global.service';

@Component({
  selector: "app-app",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private titleService: Title, public global: GlobalService) { }

  ngOnInit() {
    localStorage.removeItem(btoa("blogData"));
  }

  setPageTitle(title: string, tab) {
    this.global.profileTab = tab
    this.titleService.setTitle(title);
  }
}
