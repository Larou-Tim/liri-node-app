var keys = require("./keys.js");
var inquirer = require("inquirer");
var twitter = require("twitter");
var spotify = require('spotify');
var request = require("request");

//Options that are used in menus
var inputOptions = [" > Show my Tweets", ` > Spotify a song`, ` > Movie Look-up`, ` > Do What it Says`, ' > Exit']

var inputs = process.argv;

// determines if menu or discrete call is being run by user
if (inputs.length == 2) {
    liriMenu();
}
else {
    var searchParam = "";
    if (inputs.length > 3) {
        for (var i = 3; i < inputs.length; i++) {
            searchParam += inputs[i] + " ";
        }
    }
    discreteCall(inputs[2], searchParam);
}

//-------------------------------
//Menus
//-------------------------------
//main lirimenu
function liriMenu() {
    var exit = false;
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do today?",
            choices: inputOptions,
            name: "start"
        }
    ]).then(function (user) {
        switch (user.start) {
            case inputOptions[0]:
                showTweets();
                break;
            case inputOptions[1]:
                spotifyMenu();
                break;
            case inputOptions[2]:
                movieMenu();
                break;
            case inputOptions[3]:
                doWhat();
                break;
            case inputOptions[4]:
                break;
        }
    });
}

//subMenus
function spotifyMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What song would you like to spotify",
            name: "spotifyParam"
        }
    ]).then(function (user) {
        spotifySong(user.spotifyParam);
    });
}

function movieMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What movie would you like to search?",
            name: "movieParam"
        }
    ]).then(function (user) {
        omdbRequest(user.movieParam);
    });
}

//-------------------------------
//Handler when calling functions by name
//-------------------------------
function discreteCall(option, param) {
    switch (option) {
        case "my-tweets":
            showTweets();
            break;
        case "spotify-this-song":
            spotifySong(param);
            break;
        case "movie-this":
            omdbRequest(param);
            break;
        case "do-what-it-says":
            doWhat();
            break;
        default: 
        console.log("-------------------------------------------------------------------");
        console.log("Action not found, please try again.");
        console.log("Try one of these options: my-tweets, spotify-this-song, movie-this, or do-what-it-says");
        console.log("-------------------------------------------------------------------");
    }
}

//-------------------------------
//Operating functions
//-------------------------------
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

        if (inputs.length == 2) {
            liriMenu();
        }
    });
}

function spotifySong(arg) {
    var songSearch = ""
    if (arg == "") {
        songSearch = ("The sign ace of base");
    }
    else {
        songSearch = arg;
    }

    spotify.search({ type: 'track', query: songSearch }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        if (data.tracks.items.length) {
            console.log("-------------------------------------------------------------------");
            console.log("Artist: ", data.tracks.items[0].artists[0].name);
            console.log("Album: ", data.tracks.items[0].album.name);
            console.log("Track Name: ", data.tracks.items[0].name);
            console.log("Previrew Link: ", data.tracks.items[0].preview_url)
            console.log("-------------------------------------------------------------------");

        }
        else {
            console.log("-------------------------------------------------------------------");
            console.log("Song: " + songSearch + " was not found!");
            console.log("-------------------------------------------------------------------");
        }

        if (inputs.length == 2) {
            liriMenu();
        }
    });

}

function omdbRequest(movie) {

    var movieRequest = "mr.nobody";

    if (movie != "") {
        movieRequest = movie;
    }

    var url = "http://www.omdbapi.com/?t=" + movieRequest + "&y=&plot=short&r=json";

    request(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            if (JSON.parse(body).Title) {
                console.log("-------------------------------------------------------------------");
                console.log("Title: ", JSON.parse(body).Title);
                console.log("Release Year: ", JSON.parse(body).Released);
                console.log("IMDB Rating: ", JSON.parse(body).imdbRating);
                console.log("Country of Production: ", JSON.parse(body).Country);
                console.log("Movie Language: ", JSON.parse(body).Language);
                console.log("Movie Plot: ", JSON.parse(body).Plot);
                console.log("Actors: ", JSON.parse(body).Actors);
                if (JSON.parse(body).Ratings) {
                    console.log("Rotten Tomatoes Rating: ", JSON.parse(body).Ratings[1].Value);
                }

                console.log("-------------------------------------------------------------------");
            }
            else {
                console.log("-------------------------------------------------------------------");
                console.log("Movie: " + movieRequest + " was not found!");
                console.log("-------------------------------------------------------------------");
            }
            if (inputs.length == 2) {
                liriMenu();
            }
        }
    });
}

function doWhat() {
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function (error, data) {
        var dataArr = data.split(",");
        discreteCall(dataArr[0], dataArr[1]);
    });
}