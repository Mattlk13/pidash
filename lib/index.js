'use strict';
import Rx from 'rx';
import fetch from 'node-fetch';

import Clock from './components/Clock';
import githubEvents from './sources/github_events';
import githubContributions from './sources/github_contributions';

var components = [
  // new Clock({x:0, y:0})
];

// githubEvents({
//   username: process.env.GITHUB_USERNAME,
//   pollInterval: 1000*60*5,
//   key: process.env.GITHUB_KEY
// }).subscribe(
//   v => console.log(v),
//   err => console.error(err),
//   () => console.log('Complete')
// );

githubContributions(process.env.GITHUB_USERNAME)
.subscribe(
  v => console.log(v),
  err => console.error(err),
  () => console.log('Complete')
);

githubContributions(process.env.GITHUB_USERNAME, process.env.GITHUB_KEY)
.subscribe(
  v => console.log(v),
  err => console.error(err),
  () => console.log('Complete')
);
