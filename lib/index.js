'use strict';
import Rx from 'rx';
import fetch from 'node-fetch';

import Clock from './components/Clock';
import githubEvents from './sources/github_events';
import githubContributions from './sources/github_contributions';
import { tomorrow, DAY } from './util/dates'


//
// Data sources
//
var newGithubUserActivity = githubEvents({
  username: process.env.GITHUB_USERNAME,
  pollInterval: 1000*60*5,
  key: process.env.GITHUB_KEY
});

var dayChanges = Rx.Observable.timer(tomorrow() - Date.now(), 1*DAY);

// Contributions are updated whenever we detect new activity on the user, or
// when the day changes.
var githubContributionUpdates = Rx.Observable
  .merge(newGithubUserActivity, dayChanges)
  .startWith(null)
  .flatMap( githubContributions(process.env.GITHUB_USERNAME) );

//
// Views
//
// githubContributionUpdates.subscribe(v => console.log(v));
