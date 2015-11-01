'use strict';
import Rx from 'rx';

export default class Clock {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.fb = opts.fb;

    this.source = Rx.Observable
      .interval(100 /* ms */)
      .timestamp()
      .map( v => Date(v))
      .distinct();
    this.subscription =
      this.source.subscribe(
        this.render, // Next
        err => console.error(err), // Error
        null // Complete
      );
  }
  render(date) {
    console.log('drawing clock', date);
  }
}
