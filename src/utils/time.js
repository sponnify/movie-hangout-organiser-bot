const moment = require('moment');

function formatEventTime(date, time) {
  const eventDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
  return eventDateTime.format('MMMM Do YYYY, h:mm a');
}

module.exports = { formatEventTime };