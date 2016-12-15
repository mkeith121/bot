'use strict';

var NepaNodeBot = require('../lib/nepanodebot.js');

var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var nepanodebot = new NepaNodeBot({
    token: token,
    dbPath: dbPath,
    name: name
});

nepanodebot.run();
