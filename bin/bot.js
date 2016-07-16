'use strict';

var YoBot = require('../lib/yo-bot');

var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var yoBot = new YoBot({
  token: token,
  dbPath: dbPath,
  name: name
});

yoBot.run();
