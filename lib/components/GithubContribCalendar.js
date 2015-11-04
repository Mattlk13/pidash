'use strict';
import Rx from 'rx';
import chroma from 'chroma-js';
import { beginningOfWeek, WEEK, MONTH_NAMES } from '../util/dates';

const GRID_CELL_SIZE = 10,
  GRID_CELL_PADDING = 2,
  GRID_CELL_SPACING = GRID_CELL_PADDING + GRID_CELL_SIZE;

const BOTTOM_ROW_HEIGHT = 23;

const FONT_NAME = 'fantasy';

const TIME_FONT_SIZE = 14,
    MONTH_FONT_SIZE = 12,
    DAY_FONT_SIZE = 12;

const FG_COLOR = [1,1,1];
const BG_COLOR = [0,0,0];

const ZERO_CONTRIBS_COLOR = [0.1, 0.1, 0.1];

export default class GithubContribCalendar {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.fb = opts.fb;
    if (this.fb) {
      this.width = this.fb.size().width - this.x;

      this.dayOfWeekGutterWidth = 20;
      this.monthHeaderHeight = 20;

      this.height = 7 * GRID_CELL_SPACING + this.monthHeaderHeight;

      this.gridAreaWidth = this.width - this.dayOfWeekGutterWidth;
      this.gridAreaHeight = this.height - this.monthHeaderHeight;

      this.weeksShown = 25;
    }

    this.source = opts.source;
      // .map( this.mapData.bind(this) );

    this.subscription =
      this.source.subscribe(
        this.render.bind(this), // Next
        err => console.error(err))
  }

  render(contribsByDate) {
    // Find the maximum contribution count for a single day
    var maxContribsPerDay = Math.max.apply(null,
      Object.keys(contribsByDate).map( k => contribsByDate[k] ));

    if (this.fb) {
      // Erase the area by painting a rect of the background color
      this.fb.color.apply(this.fb, BG_COLOR);
      this.fb.rect(this.x, this.y, this.width, this.height, true, 0);

      // Draw the days of the week
      this.fb.color.apply(this.fb, FG_COLOR);
      this.fb.font(FONT_NAME, DAY_FONT_SIZE);
      for (let dayNum = 1; dayNum <= 5; dayNum += 2) {
        this.fb.text(
          this.x + this.dayOfWeekGutterWidth / 2,
          this.y + dayNum * GRID_CELL_SPACING + this.monthHeaderHeight + GRID_CELL_SIZE / 2,
          {1: 'M', 3: 'W', 5: 'F'}[dayNum], true, 0);
      }

      // Create the color scale
      var colorScale = chroma.scale(['#1e6823','#d6e685'])
        .mode('lab')
        .correctLightness()
        .domain([1,maxContribsPerDay])
        .classes(4);
      var colorForCount = function(count) {
        if (count == 0) return ZERO_CONTRIBS_COLOR;
        else return colorScale(count).gl();
      }

      // Paint the day grid.  As we encounter the first of the month, paint the
      // label for that month above the grid
      for (var dateStr of Object.keys(contribsByDate)) {
        var date = new Date(dateStr),
          contribCount = contribsByDate[dateStr];

        var [gridX, gridY] = this._dateToGridCoords(date);
        if (gridX < 0) continue;
        var screenX = this.x + gridX * GRID_CELL_SPACING + this.dayOfWeekGutterWidth,
            screenY = this.y + gridY * GRID_CELL_SPACING + this.monthHeaderHeight;

        if (contribCount > 0) {
          this.fb.color.apply(this.fb, colorScale(contribCount).gl());
          this.fb.rect(
            screenX, // x
            screenY, // y
            GRID_CELL_SIZE, // width
            GRID_CELL_SIZE, // height
            true, // Fill?
            0 // Border width
          );
        }
        else {
          this.fb.color.apply(this.fb, ZERO_CONTRIBS_COLOR);
          this.fb.rect(
            screenX, // x
            screenY, // y
            GRID_CELL_SIZE - 2, // width
            GRID_CELL_SIZE - 2, // height
            false, // Fill?
            1 // Border width
          );
        }

        if (date.getDate() == 1) {
          // Paint the month label above this week
          this.fb.color.apply(this.fb, FG_COLOR);
          this.fb.font(FONT_NAME, MONTH_FONT_SIZE);
          this.fb.text(
            screenX,
            this.y + MONTH_FONT_SIZE,
            MONTH_NAMES[date.getMonth()], false, 0);
        }
      }
    }
  }

  _dateToGridCoords(date, now = new Date()) {
    // How many weeks ago is this date?
    var weeksAgo = Math.floor((beginningOfWeek(now) - beginningOfWeek(date)) / WEEK);


    return [this.weeksShown - weeksAgo - 1, date.getDay()];
  }

}
