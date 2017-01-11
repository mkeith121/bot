'use strict';

const util = require('util');
const path = require('path');
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
};

NepaNodeBot.prototype._firstRunCheck = function () {
};

NepaNodeBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi guys, ' +
        '\n I can tell jokes, but very honest ones. Type `/nepa` or `/' + this.name + '` to invoke me!',
        {as_user: true});
};

NepaNodeBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromNepaNodeBot(message) &&
        this._isMentioningNepaNodeBot(message)
    ) {
        this._replyToMessage(message);
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
    return message.text.toLowerCase().indexOf('nepa') > -1;
};

NepaNodeBot.prototype._replyToMessage = function (message) {
    const self = this;
    const channel = self._getChannelById(message.channel);
    const textReply = self._textReply(message);
    self.postMessageToChannel(channel.name, textReply, {as_user: true});
};

NepaNodeBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

NepaNodeBot.prototype._textReply = (message) => {
    const checkText = message.text.toLowerCase();
    if (checkText.indexOf('joke') >= 0) {
        return "!false //it's funny because it's true";

    } else if (checkText.indexOf('test') >= 0) {
        return "Hello, world!";

    } else {
        return "Command not found."
    }
};
