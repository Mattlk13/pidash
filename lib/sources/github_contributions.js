import Rx from 'rx';
import fetch from 'node-fetch';
import htmlparser from 'htmlparser2';

function scrape(username, key) {
  return fetch('https://github.com/users/'+username+'/contributions')
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
                // fillHex = attribs['fill'],
                // fill = [parseInt(fillHex.substr(1,2), 16)/255.0,
                //         parseInt(fillHex.substr(3,2), 16)/255.0,
                //         parseInt(fillHex.substr(5,2), 16)/255.0];
            contributions[date] = count;
            // contributions[date.getTime()] = { count: count, fill: fill};
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
