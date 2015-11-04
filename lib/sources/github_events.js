import Rx from 'rx';
import fetch from 'node-fetch';

export default function({username, triggerStream, key} = {}) {
  // Keep track of the last-modified responses
  var lastModifiedBehavior = new Rx.BehaviorSubject(null);

  // Requests are mapped from the timer to the
  var responses = lastModifiedBehavior
    .sample(triggerStream)
    .flatMap( lastModified => {
      var url = `https://api.github.com/users/${username}/events/public`;
      console.log("GET", url);
      var headers = {};
      if (lastModified) headers['If-Modified-Since'] = lastModified;
      if (key) headers['Authorization'] = 'token ' + key;

      return Rx.Observable.fromPromise(fetch(url, { headers }))
    });


  // Responses with API are those with 200 status codes
  var responsesWithData = responses
    .filter( res => res.status < 300)
    .tapOnNext(
      resp => lastModifiedBehavior.onNext( resp.headers.get('last-modified')));

  // Responses will need their .json() function, which returns a promise, called
  // in order to dig out usable data from them
  return responsesWithData.flatMap(
    resp => Rx.Observable.fromPromise( resp.json() ))
    .flatMap( events => Rx.Observable.fromArray(events).take(1))
    .pluck('created_at')
    .map( d => new Date(d));
}
