import {
  Directive,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
} from "@angular/core";

import { Subject, Observable, Subscription, timer } from "rxjs";
import { switchMap, take, tap } from "rxjs/operators";

@Directive({
  selector: "[counter]",
})
export class CounterDirective implements OnChanges, OnDestroy {
  private _counterSource$ = new Subject<any>();
  private _subscription = Subscription.EMPTY;

  @Input() counter: number;
  @Input() interval: number;
  @Input() status: boolean;
  @Output() value = new EventEmitter<{ value: string; count: number }>();
  seconds: any;
  minutes: any;
  hours: any;
  Interval: any;
  constructor() {
    console.log(this.counter);
  }

  onChangeStatus() {
    if (this.status) {
      this.Interval = setInterval(() => {
        this.hours = Math.floor(this.counter / (60 * 60));
        this.minutes = Math.floor((this.counter / 60) % 60);
        this.seconds = this.counter % 60;
        this.hours = this.hours < 10 ? "0" + this.hours : this.hours;
        this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;
        this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
        this.value.emit({
          value: this.hours + ":" + this.minutes + ":" + this.seconds,
          count: this.counter,
        });
        if (++this.counter < 0) {
          clearInterval(this.Interval);
        }
      }, this.interval);
    } else {
      this.hours = Math.floor(this.counter / (60 * 60));
      this.minutes = Math.floor((this.counter / 60) % 60);
      this.seconds = this.counter % 60;
      this.hours = this.hours < 10 ? "0" + this.hours : this.hours;
      this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;
      this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
      this.value.emit({
        value: this.hours + ":" + this.minutes + ":" + this.seconds,
        count: this.counter,
      });
      clearInterval(this.Interval);
    }
  }

  ngOnChanges() {
    console.log(this.counter);
    this.onChangeStatus();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
