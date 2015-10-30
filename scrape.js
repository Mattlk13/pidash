var fetch = require('node-fetch'),
  htmlparser = require('htmlparser2');

function scrape(username) {
  return fetch('https://github.com/users/'+username+'/contributions')
    .then(function(res) {
      return res.text();
    })
    .then(function(body) {
      var contributions = {};
      var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
          if(name === "rect" && attribs['class'] === "day"){
            var count = parseInt(attribs['data-count']),
                dateStr  = attribs['data-date'],
                dateParts = dateStr.split('-'),
                date = new Date(dateParts[0], dateParts[1]-1, dateParts[2]),
                fillHex = attribs['fill'],
                fill = [parseInt(fillHex.substr(1,2), 16)/255.0,
                        parseInt(fillHex.substr(3,2), 16)/255.0,
                        parseInt(fillHex.substr(5,2), 16)/255.0];
            contributions[date.getTime()] = { count: count, fill: fill};
          }
        },
      }, {decodeEntities: true});
      parser.write(body);
      parser.end()
      return contributions;
    });
}

module.exports = scrape;
