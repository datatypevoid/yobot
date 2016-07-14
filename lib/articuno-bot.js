'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');

var ArticunoBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.name = this.settings.name || 'articunobot';
}

// Inherits `methods` and `properties` from the `Bot` `constructor`
util.inherits(ArticunoBot, Bot);

module.exports = ArticunoBot;
