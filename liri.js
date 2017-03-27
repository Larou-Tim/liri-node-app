var keys = require("./keys.js");
var inquirer = require("inquirer");
var twitter = require("twitter");
var spotify = require('spotify');

var inputOptions = ["my-tweets", `spotify-this-song`, `movie-this`, `do-what-it-says`, 'Exit']

liriMenu();

function liriMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do today?",
            choices: inputOptions,
            name: "start"
        }


    ]).then(function (user) {

        switch (user.start) {

            case "my-tweets":
                showTweets();
                break;
            case "spotify-this-song":
                spotifyMenu();
                break;
            case "movie-this":
                break;
            case "do-what-it-says":
                break;
            case "Exit":
                break;
            default:
                console.log("I'm sorry your options are:")
                for (var i = 0; i < inputOptions.length; i++) {
                    console.log(" * " + inputOptions[i]);
                }
                liriMenu();
                break;
        }
    });
}

function showTweets() {
    var twitterClient = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = { screen_name: 'MisterSpark1es' };
    twitterClient.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("-------------------------------------------------------------------");
                console.log("Tweet: ", tweets[i].text);
            }

        }
        console.log("-------------------------------------------------------------------");
        liriMenu();
    });
}

// * Artist(s)
//      * The song's name
//      * A preview link of the song from Spotify
//      * The album that the song is from

//    * if no song is provided then your program will default to
//      * "The Sign" by Ace of Base

function spotifyMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What song would you like to spotify",
            name: "spotifyParam"
        }

        //could add input for track//artist//album

    ]).then(function (user) {
        if (user.spotifyParam == "") {
            spotifySong("The sign ace of base");
        }
        else {
            spotifySong(user.spotifyParam);
        }
    });

}
function spotifySong(arg) {


    spotify.search({ type: 'track', query: arg }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log("-------------------------------------------------------------------");
        console.log("Artist: ", data.tracks.items[0].artists[0].name);
        console.log("Album: ", data.tracks.items[0].album.name);
        console.log("Track Name: ", data.tracks.items[0].name);
        console.log("Previrew Link: ", data.tracks.items[0].preview_url)
        console.log("-------------------------------------------------------------------");
        liriMenu();
    });

}