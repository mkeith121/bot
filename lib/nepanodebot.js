'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');
const SQLite = require('sqlite3').verbose();
const Bot = require('slackbots');

const NepaNodeBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.name = this.settings.name || 'nepanodebot';
  this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'nepanodebot.db');

  this.user = null;
  this.db = null;
};

util.inherits(NepaNodeBot, Bot);

module.exports = NepaNodeBot;

NepaNodeBot.prototype.run = function () {
  NepaNodeBot.super_.call(this, this.settings);

  this.on('start', this._onStart);
  this.on('message', this._onMessage);
};

NepaNodeBot.prototype._onStart = function () {
  this._loadBotUser();
  this._connectDb();
  this._firstRunCheck();
};

NepaNodeBot.prototype._loadBotUser = function () {
    const self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

NepaNodeBot.prototype._connectDb = function () {
    if (!fs.existsSync(this.dbPath)) {
        console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
        process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
};

NepaNodeBot.prototype._firstRunCheck = function () {
    const self = this;
    self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }

        const currentTime = (new Date()).toJSON();

        // this is a first run
        if (!record) {
            self._welcomeMessage();
            return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
        }

        // updates with new last running time
        self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    });
};

NepaNodeBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi guys, ' +
        '\n I can tell jokes, but very honest ones. Just say `NEPA` or `' + this.name + '` to invoke me!',
        {as_user: true});
};

NepaNodeBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromNepaNodeBot(message) &&
        this._isMentioningNepaNodeBot(message)
    ) {
        this._replyWithRandomJoke(message);
    }
};

NepaNodeBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

NepaNodeBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

NepaNodeBot.prototype._isFromNepaNodeBot = function (message) {
    return message.user === this.user.id;
};

NepaNodeBot.prototype._isMentioningNepaNodeBot = function (message) {
    return message.text.toLowerCase().indexOf('nepa') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

NepaNodeBot.prototype._replyWithRandomJoke = function (originalMessage) {
    var self = this;
    var channel = self._getChannelById(originalMessage.channel);
    self.postMessageToChannel(channel.name, "NEPA is a great place to be a bot!", {as_user: true});
};

NepaNodeBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};
