'use strict';
import Rx from 'rx';

const TIME_FONT_NAME = 'fantasy';
const TIME_FONT_SIZE = 16;
const FG_COLOR = [1,1,1];
const BG_COLOR = [0,0,0];

function lpad(num, padTo, char) {
  var padChar = char || '0';
  var numStr = num.toString(10);
  while (numStr.length < padTo) {
    numStr = padChar + numStr;
  }
  return numStr;
}

function nowStr(now) {
  var hours = now.getHours() % 12;
  hours = (hours == 0 ? 12 : hours).toString();
  var mins = lpad(now.getMinutes(), 2);
  var secs = lpad(now.getSeconds(), 2);
  var ampm = (now.getHours() >= 12 ? 'pm' : 'am');
  return hours + ':' + mins + ':' + secs + ' ' + ampm;
}

export default class Clock {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.fb = opts.fb;
    this.width = this.fb.size().width / 2;  // Hardcoded to be half the screen width
    this.height = TIME_FONT_SIZE / 0.7;  // Assumes a font cap height of 0.7 (arbitrary guess)

    // TODO: Make this tick starting exactly on the next second (using .timer)
    this.source = Rx.Observable
      .interval(1000 /* ms */)
      .timestamp()
      .map( v => new Date(v.timestamp));
    this.subscription =
      this.source.subscribe(
        this.render.bind(this), // Next
        err => console.error(err)
      ); // Error
  }

  render(date) {
    this.fb.color.apply(this.fb, BG_COLOR);
    this.fb.rect(this.x, this.y, this.width, this.height, true, 0);

    this.fb.color.apply(this.fb, FG_COLOR);
    this.fb.font(TIME_FONT_NAME, TIME_FONT_SIZE);
    this.fb.text(this.x,this.y+TIME_FONT_SIZE, nowStr(date), false, 0);
  }
}
