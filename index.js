var pitft = require('pitft');
var DateUtil = require('./dates');
var scrapeGithub = require('./scrape');

var fb = pitft("/dev/fb1", true);

fb.clear();
var TIME_FONT_SIZE = 14,
    MONTH_FONT_SIZE = 12,
    DAY_FONT_SIZE = 12,
    DAY_BLOCK_SIZE = 10,
    DAY_BLOCK_PADDING = 2,
    NUM_WEEKS = 25;
var xMax = fb.size().width;
var yMax = fb.size().height;

var githubData = {};
// var dayPadding = 2;
// var daySize = 10;
// var daySpacing = dayPadding + daySize;
//
// fb.color(0.2,0.2,0.2);
//
// function startOfDay(date) {
//   return new Date(
//     date.getFullYear(),
//     date.getMonth(),
//     date.getDate(),
//     0,0,0);
// }
//
// function addDays(date, days) {
//   var retDate = new Date();
//   retDate.setTime(date + days * 24 * 60 * 60 * 1000);
//   return retDate;
// }
//
// function dayBlock(date, now) {
//   var dayOfWeek = date.getDay();
// }
//
// var x, y;
// var dayTop = yMax - 7 * daySpacing;
// var dayLeft = xMax - 26 * daySpacing;
// for (var weeksAgo = 0; weeksAgo < 26; weeksAgo++) {
//   for (var dayNum = 0; dayNum < 7; dayNum ++) {
//     x = xMax - weeksAgo * daySpacing + dayLeft;
//     y = dayTop + dayNum * daySpacing;
//
//     fb.rect(x,y, daySize, daySize);
//   }
// }
// // for (var x=0; x<xMax - daySpacing; x+= daySpacing ) {
// //   for (var y=0; y < yMax - daySpacing; y+= daySpacing) {
// //     console.log(x,y, daySize, daySize);
// //     fb.rect(x,y, daySize, daySize);
// //   }
// // }
fb.color(1,1,1);
fb.font("fantasy", 10);
fb.text(4,12,"JAN", false, 0);

function lpad(num, padTo, char) {
  var padChar = char || '0';
  var numStr = num.toString(10);
  while (numStr.length < padTo) {
    numStr = padChar + numStr;
  }
  return numStr;
}
function nowStr() {
  var now = new Date()
  var hours = now.getHours() % 12;
  hours = (hours == 0 ? 12 : hours).toString();
  var mins = lpad(now.getMinutes(), 2);
  var secs = lpad(now.getSeconds(), 2);
  var ampm = (now.getHours() >= 12 ? 'pm' : 'am');
  return hours + ':' + mins + ':' + secs + ' ' + ampm;
}

function dayBlock(date, now) {
  var dayOfWeek = date.getDay();
  var weeksAgo = Math.max(0, Math.floor((now - DateUtil.startOfWeek(date)) / (7 * 24 * 60 * 60 * 1000)));

  return {
    dayOfWeek: dayOfWeek,
    weeksAgo: weeksAgo
  };
}

function renderDayBlocks() {



  var now = DateUtil.startOfDay(new Date()),
    blockSpacing = DAY_BLOCK_PADDING + DAY_BLOCK_SIZE;
  var gridWidth = (1+NUM_WEEKS) * blockSpacing - DAY_BLOCK_PADDING,
      gridHeight = 7 * blockSpacing - DAY_BLOCK_PADDING;
  var gridX = xMax - gridWidth,
      gridY = yMax - gridHeight - TIME_FONT_SIZE - DAY_BLOCK_PADDING;

  var dayBlockToPoint = function(weeksAgo, dayOfWeek) {
    return {
      x: gridX + (25 - weeksAgo)*blockSpacing,
      y: gridY + dayOfWeek * blockSpacing
    };
  }
  for (var date of DateUtil.dayRange(DateUtil.startOfWeek(DateUtil.addDays(new Date(), NUM_WEEKS*-7)), new Date())) {
    var block = dayBlock(date, DateUtil.startOfWeek(now));
    var pt = dayBlockToPoint(block.weeksAgo, block.dayOfWeek);

    if (githubData[date.getTime()]) {
      var daysContribs = githubData[date.getTime()];
      fb.color.apply(fb, daysContribs.fill.map(function(v) { return 1 - v;}));
    }
    else {
      fb.color(0.07, 0.07, 0.07);
    }
    fb.rect(pt.x,pt.y,DAY_BLOCK_SIZE, DAY_BLOCK_SIZE);

    if (date.getDate() == 1) {
      // Render the month name on top
      pt = dayBlockToPoint(block.weeksAgo, -1);
      var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      fb.color(1,1,1);
      fb.font('fantasy', MONTH_FONT_SIZE);
      fb.text(pt.x,pt.y, monthName[date.getMonth()], false, 0);
    }
  }

  fb.color(1,1,1);
  for (var dayNum = 1; dayNum <= 5; dayNum += 2) {
    var pt = dayBlockToPoint(NUM_WEEKS, dayNum);
    fb.font('fantasy', DAY_FONT_SIZE);
    fb.text(pt.x, pt.y, {1: 'M', 3: 'W', 5: 'F'}[dayNum], false, 0);
  }
  // console.log({
  //   gridWidth: gridWidth,
  //   gridHeight: gridHeight,
  //   gridX: gridX,
  //   gridY: gridY,
  //   xMax: xMax,
  //   yMax: yMax
  // });
  // Labels
}


function renderTime() {
  fb.color(1,1,1);
  fb.font('fantasy', TIME_FONT_SIZE);
  fb.text(0,yMax, nowStr(), false, 0);
}


function render() {
  fb.clear();
  renderTime();
  renderDayBlocks();
  fb.blit();
}

function updateData() {
  scrapeGithub().then(function(data) {
    // console.log(data)
    githubData = data;
  })
}
updateData();
setInterval(updateData, 5000*60);
setInterval(render, 100);
// render();
