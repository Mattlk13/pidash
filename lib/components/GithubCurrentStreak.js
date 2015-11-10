'use strict';
import Rx from 'rx';
import TextGauge from './TextGauge';

const WARNING_FG_COLOR = [1,0,0];

export default class GithubCurrentStreak extends TextGauge {
  mapData(contribsByDate) {
    var dates = Object.keys(contribsByDate)
      .map(d => new Date(d))
      .sort( (a,b) => b-a );

    var streakStart = dates[0], streakEnd, streakDays=0;

    while (streakDays < dates.length && !streakEnd) {
      if (contribsByDate[dates[streakDays].toString()] == 0) {
        streakEnd = dates[streakDays];
        break;
      }
      else {
        streakDays++;
      }
    }

    return {
      fgColor: (streakDays > 0) ? undefined : WARNING_FG_COLOR,
      value: streakDays,
      label: 'CURRENT STREAK'
    };
  }
}
