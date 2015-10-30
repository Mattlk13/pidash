function startOfDay(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,0,0);
}
function startOfWeek(date) {
  return startOfDay(addDays(startOfDay(date), -1 * date.getDay()));
}

function addDays(date, days) {
  var retDate = new Date();
  retDate.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  return startOfDay(retDate);
}


function* dayRange(from, to) {
  var date = startOfDay(from);
  while (date <= to) {
    yield date;
    date = addDays(date, 1);
  }
}
// var now = startOfDay(new Date());
// for (var date of dayRange(addDays(now, -26*7), now)) {
//   console.log(date, dayBlock(date, startOfWeek(now)));
// }
module.exports = {
  dayRange: dayRange,
  startOfWeek: startOfWeek,
  startOfDay: startOfDay,
  addDays: addDays
};
