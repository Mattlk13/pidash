'use strict';
import Rx from 'rx';

const NUMBER_FONT_NAME = 'fantasy';
const NUMBER_FONT_SIZE = 24;
const LABEL_FONT_NAME = 'fantasy';
const LABEL_FONT_SIZE = 10;
const FG_COLOR = [1,1,0];
const BG_COLOR = [0.2,0.2,0];

function contribCount(contribsByDate) {
  return Object.keys(contribsByDate).reduce( (sum, date) => contribsByDate[date] + sum, 0);
}

export default class GithubYearContribs {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.fb = opts.fb;

    this.width = this.fb.size().width / 3;  // Hardcoded to be half the screen width
    this.height = NUMBER_FONT_SIZE / 0.7;  // Assumes a font cap height of 0.7 (arbitrary guess)

    // TODO: Make this tick starting exactly on the next second (using .timer)
    this.source = opts.source
      .map( contribCount );

    this.subscription =
      this.source.subscribe(
        this.render.bind(this), // Next
        err => console.error(err)
      ); // Error
  }

  render(count) {
    console.log("got count", count);
    this.fb.color([0,0,1]);
    this.fb.rect(0,0,50,50,true,0);

    this.fb.color.apply(this.fb, BG_COLOR);
    this.fb.rect(this.x, this.y, this.width, this.height, true, 0);

    this.fb.color.apply(this.fb, FG_COLOR);
    this.fb.font(NUMBER_FONT_NAME, NUMBER_FONT_SIZE);
    this.fb.text(this.x + this.width/2, this.y + this.height/2, count.toString(10), true, 0);

    this.fb.color.apply(this.fb, FG_COLOR);
    this.fb.font(LABEL_FONT_NAME, LABEL_FONT_SIZE);
    this.fb.text(this.x + this.width/2, this.y + this.height, "CONTRIBUTIONS", true, 0);

  }
}
