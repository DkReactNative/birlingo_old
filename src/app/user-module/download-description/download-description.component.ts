import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-download-description',
  templateUrl: './download-description.component.html',
  styleUrls: ['./download-description.component.sass']
})
export class DownloadDescriptionComponent implements OnInit {

  constructor(public global: GlobalService) {
    this.global.profileTab = 3
  }

  ngOnInit() {
  }

}
