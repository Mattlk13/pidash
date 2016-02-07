'use strict';
import Rx from 'rx';
import fetch from 'node-fetch';

import githubContributions from './sources/github_contributions';
import { tomorrow, DAY, MINUTE, HOUR, SECOND} from './util/dates'

import Clock from './components/Clock';
import GithubYearContribs from './components/GithubYearContribs';
import GithubLongestStreak from './components/GithubLongestStreak';
import GithubCurrentStreak from './components/GithubCurrentStreak';
import GithubContribCalendar from './components/GithubContribCalendar';

var githubUser = process.env.GITHUB_USERNAME,
    githubKey  = process.env.GITHUB_KEY;

const GITHUB_EVENT_POLL_INTERVAL = 5*MINUTE;

console.log('Starting Pidash');

//
// Data sources
//

// Every 5 minutes, check the github user events feed, to see if they've done
// anything recently.
var contribFetchTrigger = Rx.Observable
  .interval(GITHUB_EVENT_POLL_INTERVAL)
  .share()
  .tapOnNext( v => console.log("contribFetchTrigger", v) );

var githubContributionUpdates = contribFetchTrigger
  .startWith(null)
  .flatMap( () => githubContributions(githubUser) )
  .tapOnNext( v => console.log("githubContributionUpdates tick"))
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
