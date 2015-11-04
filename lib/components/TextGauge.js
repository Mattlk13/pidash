'use strict';
import Rx from 'rx';

const VALUE_FONT_NAME = 'fantasy';
const VALUE_FONT_SIZE = 28;
const LABEL_FONT_NAME = 'fantasy';
const LABEL_FONT_SIZE = 10;
const FG_COLOR = [1,1,1];
const BG_COLOR = [0,0,0];
const CAP_HEIGHT = 0.7;  // (arbitrary guess) font cap height of 0.7

export default class TextGauge {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.fb = opts.fb;
    if (this.fb) {
      this.width = this.fb.size().width / 3;  // Hardcoded to be a third of the screen width

      var valueHeight = VALUE_FONT_SIZE / CAP_HEIGHT,
        labelHeight = LABEL_FONT_SIZE / CAP_HEIGHT;

      this.height = valueHeight + labelHeight;

      this.valueCenterDY = valueHeight / 2;
      this.labelCenterDY = valueHeight + labelHeight / 2;
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

  render({label, value, fgColor = FG_COLOR} = {}) {
    if (this.fb) {
      // Erase the area by painting a rect of the background color
      this.fb.color.apply(this.fb, BG_COLOR);
      this.fb.rect(this.x, this.y, this.width, this.height, true, 0);

      // Write the gauge value
      this.fb.color.apply(this.fb, fgColor);
      this.fb.font(VALUE_FONT_NAME, VALUE_FONT_SIZE);
      this.fb.text(this.x + this.width/2, this.y + this.valueCenterDY, value.toString(10), true, 0);

      // Write the gauge label
      this.fb.font(LABEL_FONT_NAME, LABEL_FONT_SIZE);
      this.fb.text(this.x + this.width/2, this.y + this.labelCenterDY, label, true, 0);
    }
    else {
      console.log("Gauge value:", value, label);
    }
  }
}
