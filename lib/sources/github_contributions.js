import Rx from 'rx';
import fetch from 'node-fetch';
import htmlparser from 'htmlparser2';

function scrape(username, key) {
  var url = 'https://github.com/users/'+username+'/contributions';
  console.log('Scraping', url);
  return fetch(url)
    .then( res => res.text())
    .then( body => {
      var contributions = {};
      var parser = new htmlparser.Parser({
        onopentag: (name, attribs) => {
          if(name === "rect" && attribs['class'] === "day"){
            var count = parseInt(attribs['data-count']),
                dateStr  = attribs['data-date'],
                dateParts = dateStr.split('-'),
                date = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
            contributions[date] = count;
          }
        },
      }, {decodeEntities: true});
      parser.write(body);
      parser.end()
      return contributions;
    });
}


export default function(username) {
  return Rx.Observable.fromPromise(scrape(username));
}
