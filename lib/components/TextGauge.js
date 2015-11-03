'use strict';
import Rx from 'rx';

const NUMBER_FONT_NAME = 'fantasy';
const NUMBER_FONT_SIZE = 24;
const LABEL_FONT_NAME = 'fantasy';
const LABEL_FONT_SIZE = 10;
const FG_COLOR = [0,1,0];
const BG_COLOR = [0,0.2,0];
const CAP_HEIGHT = 0.7;  // (arbitrary guess) font cap height of 0.7

export default class TextGauge {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.fb = opts.fb;
    if (this.fb) {
      this.width = this.fb.size().width / 3;  // Hardcoded to be a third of the screen width

      var numberHeight = NUMBER_FONT_SIZE / CAP_HEIGHT,
        labelHeight = LABEL_FONT_SIZE / CAP_HEIGHT;

      this.height = numberHeight + labelHeight;
      
      this.numberCenterDY = numberHeight / 2;
      this.labelCenterDY = numberHeight + labelHeight / 2;
    }

    // TODO: Make this tick starting exactly on the next second (using .timer)
    this.source = opts.source
      .map( this.mapData.bind(this) );

    this.subscription =
      this.source.subscribe(
        this.render.bind(this), // Next
        err => console.error(err)
      ); // Error
  }

  mapData(v) {
    return v;
  }

  render({label, count} = {}) {
    console.log("got count", count);

    if (this.fb) {
      this.fb.color.apply(this.fb, BG_COLOR);
      this.fb.rect(this.x, this.y, this.width, this.height, true, 0);

      this.fb.color.apply(this.fb, FG_COLOR);
      this.fb.font(NUMBER_FONT_NAME, NUMBER_FONT_SIZE);
      this.fb.text(this.x + this.width/2, this.y + this.numberCenterDY, count.toString(10), true, 0);

      this.fb.color.apply(this.fb, FG_COLOR);
      this.fb.font(LABEL_FONT_NAME, LABEL_FONT_SIZE);
      this.fb.text(this.x + this.width/2, this.y + this.labelCenterDY, label, true, 0);
    }
  }
}
