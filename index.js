var spawn       = require('child_process').spawn;
var colors      = require("colors");
var request     = require("request");
var rl          = require("readline");
var formatter   = require("./formatter");

function handleInput(question, options, callback) {
    var readline = require('readline');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(question + " ", function (answer) {
        rl.close();
        if (answer === 'g')
            getGames();
        else if (answer === 'f')
            getFeatured();
        else if (answer === 'm')
            showMainMenu();
        else
            callback(options[parseInt(answer)][0]);
    });
}

function getFeatured() {
    request({
        url: "https://api.twitch.tv/kraken/streams/featured"
    }, function(err, response, body) {
        var json = JSON.parse(body);
        var featured = json.featured;
        var streamers = [];
        for (var i = 0; i < featured.length; i++) {
            var stream = featured[i].stream;
            var channel = stream.channel;
            var channel_name = channel.display_name;
            var channel_status = channel.status.slice(0, 40);
            var viewers = stream.viewers;

            streamers[i] = [channel_name, channel_status, viewers];
        }
        var col = [colors.red, colors.lightgrey, colors.blue, colors.yellow];
        formatter.table(streamers, {"colors":col, "delimeter_color":colors.red});
        openStreams(streamers);
    });

}

function getGames() {
    var games = [];

    request({
        url: "https://api.twitch.tv/kraken/games/top?limit=25&offset=0",
    }, function (err, response, body) {
        var json = JSON.parse(body);
        var top = json.top;
        for (var i = 0; i < top.length; i++) {
            var info = top[i];
            var game_info = info.game;
            var game_name = game_info.name;
            var game_viewers = info.viewers;

            games[i] = [game_name, game_viewers];
        }
        var col = [colors.red, colors.lightgrey, colors.yellow];
        formatter.table(games, {"colors":col, "delimeter_color":colors.red});
        openGame(games);
    });
}

function getStreamsForGame(gamename) {
    request({
        url: "https://api.twitch.tv/kraken/streams?game="+gamename
    }, function(err, response, body) {
        var json = JSON.parse(body);
        var streams = json.streams;
        var streamers = [];
        for (var i = 0; i < streams.length; i++) {
            var channel = streams[i].channel;
            var channel_name = channel.display_name;
            var channel_status = channel.status.slice(0, 40);
            var viewers = streams[i].viewers;

            streamers[i] = [channel_name, channel_status, viewers];
        }
        var col = [colors.red, colors.lightgrey, colors.blue, colors.yellow];
        formatter.table(streamers, {"colors":col, "delimeter_color":colors.red});
        openStreams(streamers);
    });
}

function showMainMenu() {
    var games = "Games (g)";
    var featured = "Featured (f)";

    var col = [colors.red, colors.lightgrey];
    var options = [[games], [featured]];
    formatter.table(options, {colors: col});
    handleInput("Open Menu (m)?", options, function(answer) {
        if (answer === games)
            getGames();
        else if (answer === featured)
            getFeatured();
        else
            showMainMenu();
    });
}

function openStreams(streams) {
    cb = function(stream) {
        const mpv = spawn('mpv', ['--fs', 'http://www.twitch.tv/' + stream]);
        mpv.on('close', (code) => {
            handleInput("Open stream number?", streams, cb);
        });
    };
    handleInput("Open stream number?", streams, cb);
}

function openGame(games) {
    handleInput("Open game number?", games, getStreamsForGame);
}

showMainMenu();
