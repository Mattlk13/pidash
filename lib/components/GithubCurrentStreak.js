'use strict';
import Rx from 'rx';
import TextGauge from './TextGauge';

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

    return { count: streakDays, label: 'CURRENT STREAK'};
  }
}
