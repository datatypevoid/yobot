# Setup

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

# Usage

```
# install rimraf globally
$ npm install -g rimraf

# Clean install
$ npm run clean:install

# Compile Sass
$ gulp sass

# Lint JavaScript with ESLint
$ gulp lint

# Build and Lint Sass on file change
$ gulp watch
```
