const moment = require('moment'); // You'll need to install this package
const { InputError } = require('./errors'); // Custom error class

// Validation function for event inputs
function validateEventInputs(eventDetails) {
  if (eventDetails.title && eventDetails.title.length === 0) {
    throw new InputError('Title must be provided!');
  }

  if (eventDetails.theatre && eventDetails.theatre.length > 50) {
    throw new InputError('Theatre name must be under 50 characters!');
  }

  if (eventDetails.date && !moment(eventDetails.date, 'YYYY-MM-DD', true).isValid()) {
    throw new InputError('Date must be in the format YYYY-MM-DD!');
  }

  if (eventDetails.time && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(eventDetails.time)) {
    throw new InputError('Time must be in the format HH:mm (24-hour format)!');
  }

  if (eventDetails.releaseDate && !moment(eventDetails.releaseDate, 'YYYY-MM-DD', true).isValid()) {
    throw new InputError('Release date must be in the format YYYY-MM-DD!');
  }

  if (eventDetails.trailer && !/^https?:\/\/[^ ]+$/.test(eventDetails.trailer)) {
    throw new InputError('Trailer must be a valid URL!');
  }

  if (eventDetails.additionalInfo && eventDetails.additionalInfo.length > 200) {
    throw new InputError('Additional information must be under 200 characters!');
  }
}

module.exports = { validateEventInputs };