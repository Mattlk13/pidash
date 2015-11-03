'use strict';
import Rx from 'rx';
import fetch from 'node-fetch';

import githubEvents from './sources/github_events';
import githubContributions from './sources/github_contributions';
import { tomorrow, DAY, MINUTE } from './util/dates'

import Clock from './components/Clock';
import GithubYearContribs from './components/GithubYearContribs';
import GithubLongestStreak from './components/GithubLongestStreak';
import GithubCurrentStreak from './components/GithubCurrentStreak';

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
}).tapOnNext( v => console.log("Found new github activity"));

// Starting at the next midnight, fire once a day
var dayChanges = Rx.Observable.timer(tomorrow() - Date.now(), 1*DAY)
  .tapOnNext( v => console.log("Day change", v));

// Contributions are updated whenever we detect new activity on the user, or
// when the day changes.
var githubContributionUpdates = Rx.Observable
  .merge(newGithubUserActivity, dayChanges)
  .startWith(null)
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
    y: fb ? (fb.size().height - 20) : 0,
    fb
  });

}

  new GithubYearContribs({
    x: 0,
    y: 0,
    fb,
    source: githubContributionUpdates
  });

  new GithubLongestStreak({
    x: 106,
    y: 0,
    fb,
    source: githubContributionUpdates
  });

  new GithubCurrentStreak({
    x: 212,
    y: 0,
    fb,
    source: githubContributionUpdates
  });
