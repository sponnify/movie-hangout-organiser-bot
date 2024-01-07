// Custom error classes
class InputError extends Error {
    constructor(message) {
      super(message);
      this.name = "InputError";
    }
  }
  
  class EventNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = "EventNotFoundError";
    }
  }
  
  class CategoryNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = "CategoryNotFoundError";
    }
  }
  
  class ChannelCreationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ChannelCreationError";
    }
  }
  
  class AnnouncementError extends Error {
    constructor(message) {
      super(message);
      this.name = "AnnouncementError";
    }
  }
  
  class HelpCommandError extends Error {
    constructor(message) {
      super(message);
      this.name = "HelpCommandError";
    }
  }
  
  module.exports = { InputError, EventNotFoundError, CategoryNotFoundError, ChannelCreationError, AnnouncementError, HelpCommandError };  