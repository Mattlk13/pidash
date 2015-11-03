'use strict';
import Rx from 'rx';
import fetch from 'node-fetch';

import githubEvents from './sources/github_events';
import githubContributions from './sources/github_contributions';
import { tomorrow, DAY, MINUTE } from './util/dates'

import Clock from './components/Clock';
import GithubYearContribs from './components/GithubYearContribs';

var githubUser = process.env.GITHUB_USERNAME,
    githubKey  = process.env.GITHUB_KEY;

console.log('Staring Pidash');

//
// Data sources
//

// Every 5 minutes, check the github user events feed, to see if they've done
// anything recently.
var newGithubUserActivity = githubEvents({
  username: githubUser,
  pollInterval: 5*MINUTE,
  key: githubKey
});

// Starting at the next midnight, fire once a day
var dayChanges = Rx.Observable.timer(tomorrow() - Date.now(), 1*DAY);

// Contributions are updated whenever we detect new activity on the user, or
// when the day changes.
var githubContributionUpdates = Rx.Observable
  .merge(newGithubUserActivity, dayChanges)
  .startWith(null)
  .tapOnNext( () => console.log('Fetching contributions...'))
  .flatMap( githubContributions(githubUser) );

//
// Views
//
// githubContributionUpdates.subscribe(v => console.log("Got contributions"));

try {
  var pitft = require('pitft');
  var fb = pitft(process.env.FRAMEBUFFER_DEVICE || '/dev/fb1');
}
catch (e) {
  console.log("Was unable to load pitft");
}

if (fb) {
  fb.clear();

  new Clock({
    x: 0,
    y: fb.size().height - 20,
    fb
  });

  new GithubYearContribs({
    x: 0,
    y: 0,
    fb,
    source: githubContributionUpdates
  });
}
