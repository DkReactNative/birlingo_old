import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.sass']
})
export class DownloadsComponent implements OnInit {

  constructor(public global: GlobalService) {
    this.global.profileTab = 3
  }

  ngOnInit() {
  }
  openUrl(type) {
    let obj = { 1: "https://play.google.com/store/apps", 2: "https://apps.apple.com/de/app/dawawas/id588285122" }
    window.open(obj[type], "_blank");
  }
}
