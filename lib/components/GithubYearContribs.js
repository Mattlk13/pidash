'use strict';
import Rx from 'rx';
import TextGauge from './TextGauge';

export default class GithubYearContribs extends TextGauge {
  mapData(contribsByDate) {
    return {
      count: Object.keys(contribsByDate).reduce( (sum, date) => contribsByDate[date] + sum, 0),
      label: 'CONTRIBUTIONS'
    }
  }
}
