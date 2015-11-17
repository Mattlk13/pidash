import Rx from 'rx';
import fetch from 'node-fetch';

var lastModifiedByUsername = {};
export default function({username, key} = {}) {
  // Keep track of the last-modified responses
  var lastModified = lastModifiedByUsername[username];

  // Requests are mapped from the timer to the
  var url = `https://api.github.com/users/${username}/events/public`;
  console.log("GET", url);

  var headers = {};
  if (lastModified) headers['If-Modified-Since'] = lastModified;
  if (key) headers['Authorization'] = 'token ' + key;

  var responses = Rx.Observable.fromPromise(fetch(url, { headers }))
    .doOnNext( res => {
      lastModifiedByUsername[username] = res.headers.get('last-modified')
      console.log("Got response from github event poll", res.status, res.headers.get('last-modified'));
    });

  // Responses will need their .json() function, which returns a promise, called
  // in order to dig out usable data from them
  return responses
    .filter( res => res.status < 300)
    .flatMap(
      resp => Rx.Observable.fromPromise( resp.json() ))
      .flatMap( events => Rx.Observable.fromArray(events)
        .map( evt => ({id: evt.id, createdAt: new Date(evt.created_at)}) )
        .max( evt => evt.createdAt )
      )
    .tapOnNext( evt => console.log('Latest event is', evt) )
    .distinct(
      evt => evt.createdAt.getTime()
    )
    .share()
    .tapOnNext( evt => console.log("New github event", evt) )
}
