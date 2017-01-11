'use strict';

var NepaNodeBot = require('../lib/nepanodebot.js');

var token = process.env.BOT_API_KEY;
var dbPath = null;
var name = null;

var nepanodebot = new NepaNodeBot({
    token: token,
    dbPath: dbPath,
    name: name
});

nepanodebot.run();
