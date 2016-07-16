'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');
var q = require('q');

var YoBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.name = this.settings.name || 'articuno';

  this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'yo-bot.db');

  this.user = null;
  this.db = null;

  this.uIDs = [];
}

// Inherits `methods` and `properties` from the `Bot` `constructor`
util.inherits(YoBot, Bot);

YoBot.prototype._areNewUsers = function() {
  var self = this;
  if(self.uIDs.length === 0) {
    return true;
  }
  for(var i = 0; i < self.users.length; i++) {
    var match = false;
    var index = self._contains.call(self.uIDs, self.users[i].id);
    if(index) {
      continue;
    }
    return true;
  }
  return false;
};

YoBot.prototype._checkUsers = function() {
  var self = this;
  console.log('Checking to see if there are any new users...');
  self._fetchUserData().then(function(existingUsers) {
    self.uIDs = existingUsers;
    if(self._areNewUsers()) {
      self._fetchUserData().then(function(existingUsers) {
        self._learnUsers(existingUsers);
      });
    } else {
      console.log('No new users to import. \n\nContinuing...');
    }
  });
};

YoBot.prototype._connectDb = function() {
  if(!fs.existsSync(this.dbPath)) {
    console.error('Database path ' + '"' + this.dbPath + '" does not exist or it is not readable.');
    process.exit(1);
  }

  this.db = new SQLite.Database(this.dbPath);
};

YoBot.prototype._contains = function(needle) {
  // Per spec, the way to identify `NaN` is that it is not equal to itself
  var findNaN = needle !== needle;
  var indexOf;

  if(!findNaN && typeof Array.prototype.indexOf === 'function') {
    indexOf = Array.prototype.indexOf;
  } else {
    indexOf = function(needle) {
      var i = -1, index = -1;

      for(i = 0; i < this.length; i++) {
        var item = this[i];

        if((findNaN && item !== item) || item === needle) {
          index = i;
          break;
        }
      }
      return index;
    };
  }
  return indexOf.call(this, needle) > -1;
};

YoBot.prototype._fetchUserData = function() {
  var self = this;
  var deferred = q.defer();
  var users = [];
  self.db.all('SELECT * FROM users', function(err, rows) {
    if(err) {
      console.log('Error:', err);
      deferred.reject(err);
    }
    if(rows.length === 0) {
      console.log('No user data to import. Continuing...');
      deferred.resolve([]);
    } else {
      for(var i = 0; i < rows.length; i++) {
        users[i] = rows[i].uid;
      }
      deferred.resolve(users);
    }
  });
  return deferred.promise;
};

YoBot.prototype._firstRunCheck = function() {
  var self = this;
  this.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function(err, record) {
    if(err) {
      return console.error('DATABASE ERROR:', err);
    }

    var currentTime = (new Date()).toJSON();

    // If this is the first run...
    if(!record) {
      self._welcomeMessage();
      return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)',
                           currentTime);
    }
    // Update with the last run time
    self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
  });
};

YoBot.prototype._getChannelById = function(channelId) {
  return this.channels.filter(function(item) {
    return item.id === channelId;
  })[0];
};

YoBot.prototype._getUserById = function(id) {
  for(var i = 0; i < this.users.length; i++) {
    if(id === this.users[i].id) {
      return this.users[i].name;
    }
  }
};

YoBot.prototype._greetNewUser = function(username) {
  var self = this;
  var greeting = '*Welcome to the Ocala branch of Team Mystic!*' +
                 '\n\nIn order to verify your identity with Team Mystic, please contact ' +
                 'Mystic Admin `0xdeadfa11` or `6r33nburn5` with a brief message ' +
                 'including a screenshot of your trainer info card from _Pokémon Go_.' +
                 '\n\nIf you need additional help, just say `' + this.name +
                 '` to invoke me!\n\n*_Winter is coming!_*\n\n<https://i.redd.it/zl3qpu1tun8x.gif>';
  setTimeout(function() {
    self.postMessageToUser(username, greeting, { as_user: true });
  }, 15000);
};

YoBot.prototype._insertNewUser = function(id) {
  console.log('Inserting id ' + id + ' into database');
  this.db.run('INSERT INTO users(uid) VALUES(?)', id);
};

YoBot.prototype._isChannelConversation = function(message) {
  return typeof message.channel === 'string' &&
           message.channel[0] === 'C';
};

YoBot.prototype._isChatMessage = function(message) {
  return message.type === 'message' && Boolean(message.text);
};

YoBot.prototype._isFromYoBot = function(message) {
  return message.user === this.user.id;
}

YoBot.prototype._isMentioningYoBot = function(message) {
  return message.text.toLowerCase().indexOf('yobot') > -1 ||
           message.text.toLowerCase().indexOf(this.name) > -1;
};

YoBot.prototype._isTeamJoin = function(message) {
  return message.type === 'team_join';
};

YoBot.prototype._learnUsers = function() {
  var self = this;
  for(var i = 0; i < self.users.length; i++) {
    var id = self.users[i].id;
    var index = self._contains.call(self.uIDs, id);
    if(index) {
      continue;
    }
    self._insertNewUser(id);
  }
};

YoBot.prototype._loadBotUser = function() {
  var self = this;
  this.user = this.users.filter(function(user) {
    return user.name === self.name;
  })[0];
};

YoBot.prototype._onMessage = function(message) {
  console.log('Event caught: ', message.type);
  if(this._isChatMessage(message) &&
     this._isChannelConversation(message) &&
     !this._isFromYoBot(message) &&
     this._isMentioningYoBot(message)
   ) {
     this._reply(message);
   }
   if(this._isTeamJoin(message)) {
     var username = message.user.name;
     this.users.push(message.user);
     this._greetNewUser(username);
   }
};

YoBot.prototype._onStart = function() {
  this._loadBotUser();
  this._connectDb();
  this._firstRunCheck();
  this._startupMessage();
  this._checkUsers();
};

YoBot.prototype._refreshUsers = function() {
  var deferred = q.defer();
  var self = this;
  self.getUsers().then(function(users) {
    console.log('Refreshing users...');
    deferred.resolve(users);
  });
  return deferred.promise;
};

YoBot.prototype._reply = function (originalMessage) {
  var self = this;
  var placeholder = 'Additional functionality is in the works. Please contact '+
                       '@0xdeadfa11 or @6r33nburn5 for any assistance you may require.';
  var channel = this._getChannelById(originalMessage.channel);
  this.postMessageToChannel(channel.name, placeholder, { as_user: true });
};

//# run
//** Calls the original constructor of the `Bot` class and attaches callback functions to the `start` and `message` event **
YoBot.prototype.run = function() {
  YoBot.super_.call(this, this.settings);
  this.on('start', this._onStart);
  this.on('message', this._onMessage);
};

YoBot.prototype._startupMessage = function() {
  this.postMessageToChannel(this.channels[0].name, '_takes to the skies_', { as_user: true });
}

YoBot.prototype._welcomeMessage = function() {
  this.postMessageToChannel(this.channels[0].name, '_takes to the skies_', { as_user: true });
}

module.exports = YoBot;
