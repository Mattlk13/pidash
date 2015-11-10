'use strict';
import Rx from 'rx';
import fetch from 'node-fetch';

import githubEvents from './sources/github_events';
import githubContributions from './sources/github_contributions';
import { tomorrow, DAY, MINUTE, HOUR, SECOND} from './util/dates'

import Clock from './components/Clock';
import GithubYearContribs from './components/GithubYearContribs';
import GithubLongestStreak from './components/GithubLongestStreak';
import GithubCurrentStreak from './components/GithubCurrentStreak';
import GithubContribCalendar from './components/GithubContribCalendar';

var githubUser = process.env.GITHUB_USERNAME,
    githubKey  = process.env.GITHUB_KEY;

console.log('Staring Pidash');

//
// Data sources
//

// Every 5 minutes, check the github user events feed, to see if they've done
// anything recently.
var eventPollInterval = Rx.Observable
  .interval(5*MINUTE)
  .tapOnNext( v => console.log("eventPollInterval", v) );

var eventCheckTrigger = eventPollInterval.share();

var newGithubUserActivity = eventCheckTrigger
  .flatMap(githubEvents({
    username: githubUser,
    triggerStream: eventCheckTrigger,
    key: githubKey
  }))
  .tapOnNext( v => console.log("Found new github activity", v) );

// Starting at the next midnight, fire once a day
var dayChanges = Rx.Observable.timer(tomorrow() - Date.now(), 1*DAY)
  .tapOnNext( v => console.log("Day change", v));

// Contributions are updated whenever we detect new activity on the user, or
// when the day changes.
var contribFetchTrigger = Rx.Observable.merge(newGithubUserActivity,dayChanges)
  .tapOnNext( v => console.log("contribFetchTrigger triggered"));

var githubContributionUpdates = contribFetchTrigger
  .startWith(null)
  .flatMap( githubContributions(githubUser) )
  .share();

//
// Views
//
try {
  var pitft = require('pitft');
  var fb = pitft(process.env.FRAMEBUFFER_DEVICE || '/dev/fb1');
}
catch (e) {
  console.log("Was unable to load pitft");
}

if (fb) {
  fb.clear();
  new Clock({ x: 0, y: fb ? (fb.size().height - 23) : 0, fb });
}

new GithubYearContribs({ x: 0, y: 0, fb,
  source: githubContributionUpdates });

new GithubLongestStreak({ x: 106, y: 0, fb,
  source: githubContributionUpdates });

new GithubCurrentStreak({ x: 212, y: 0, fb,
  source: githubContributionUpdates });

new GithubContribCalendar({ x: 0, y: 86, fb,
  source: githubContributionUpdates });
