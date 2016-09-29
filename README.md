[![Dependency Status](https://david-dm.org/datatypevoid/yobot.svg)](https://david-dm.org/datatypevoid/yobot) [![volkswagen status](https://auchenberg.github.io/volkswagen/volkswargen_ci.svg?v=1)](https://travis-ci.org/datatypevoid/yobot) [![GitHub tag](https://img.shields.io/github/tag/datatypevoid/yobot.svg?maxAge=2592000)](https://github.com/datatypevoid/yobot) [![license](https://img.shields.io/github/license/datatypevoid/yobot.svg?maxAge=2592000)](https://github.com/datatypevoid/yobot/blob/master/LICENSE)

# yobot [![Join Slack](https://img.shields.io/badge/slack-join-brightgreen.svg)](http://www.davidniciforovic.com/wp-login.php?action=slack-invitation) [![Join the chat at https://gitter.im/datatypevoid/yobot](https://badges.gitter.im/datatypevoid/yobot.svg)](https://gitter.im/datatypevoid/yobot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Setup

Fork this project.

Navigate to the directory you want this project to reside in.

Run `$ git clone https://github.com/your-username-here/yobot.git && cd yobot`

Run `$ npm install`

Create a new bot integration for your `Slack` team.

Create a new text file at the root of this project called `welcome.txt` containing the welcome message you would like delivered by this bot to new users on your Slack team.

Optionally, edit the `first-start.txt` and `start.txt` files to alter the message that is displayed the first time the bot is run and the message displayed each time this bot start up, respectively.

> If you are unsure of how to do this, please visit the [bot user API docs](https://api.slack.com/bot-users) and see the `Setting up your bot user` section

Run `$ BOT_API_KEY=xxxx-xxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx node bin/bot.js` to fire up Yo-Bot, where `xxxx-xxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx` is your bot's `API token`

Invite your bot into the desired channels you wish it to be accessible from, but at the very least the `general` channel for you team.

Profit.

## Usage

```
# install rimraf globally
$ npm install -g rimraf

# Clean install
$ npm run clean:install

# Lint JavaScript with ESLint
$ gulp lint

# Build and Lint Sass on file change
$ gulp watch
```
