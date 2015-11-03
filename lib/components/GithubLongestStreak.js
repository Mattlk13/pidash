'use strict';
import Rx from 'rx';
import TextGauge from './TextGauge';

export default class GithubLongestStreak extends TextGauge {
  mapData(contribsByDate) {
    var streaks = Object.keys(contribsByDate)
      .map(d => new Date(d))
      .sort( (a,b) => a.getTime() - b.getTime())
      .reduce( (streaks, date, idx, dates) => {
        // Does this day count?
        if (contribsByDate[date.toString()] > 0) {
          var streak = streaks.slice(-1)[0];

          // Are we modifying the streak, or starting another?
          if (streak && streak.end == dates[idx-1]) {
            streak.days++;
            streak.end = date;
          }
          else {
            streaks.push({ days: 1, start: date, end: date});
          }
        }
        return streaks;
      },[]);

    var longest = streaks.sort( (a,b) => b.days - a.days )[0];

    console.log(streaks);
    console.log("longest: ", longest);

    return { count: longest ? longest.days : 0, label: 'LONGEST STREAK'};
  }
}
