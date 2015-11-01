import Rx from 'rx';
import fetch from 'node-fetch';

export default function({username, pollInterval, key}) {
  console.log(username, pollInterval);
  // Keep track of the cache headers
  var lastModifiedBehavior = new Rx.BehaviorSubject(null);

  // Periodic interval to poll github
  var requestTimer = Rx.Observable
    .interval(pollInterval /* ms */)
    .startWith(null);

  // Requests are mapped from the timer to the
  var responses = requestTimer
    .withLatestFrom( lastModifiedBehavior )
    .flatMap( ([_,lastModified]) => {
      var url = `https://api.github.com/users/${username}/events`;

      return Rx.Observable.fromPromise(
        fetch(url, {
          headers: {
            'Authorization': 'token ' + key,
            'If-Modified-Since': lastModified
          }
        })
      )
    })
    .tapOnNext(
      resp => console.log(resp.status, resp.statusText)
    )
    .tapOnError(
      err => console.error(err)
    );

  // Responses with API are those with 200 status codes
  var responsesWithData = responses
    .filter( res => res.status < 300)
    .tapOnNext(
      resp => lastModifiedBehavior.onNext( resp.headers.get('last-modified')));

  // Responses will need their .json() function, which returns a promise, called
  // in order to dig out usable data from them
  return responsesWithData.flatMap(
    resp => Rx.Observable.fromPromise(resp.json()) );
}
