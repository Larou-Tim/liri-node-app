var keys = require("./keys.js");
var inquirer = require("inquirer");
var twitter = require("twitter");
var spotify = require('spotify');
var request = require("request");

// add arg to not call menu if discrete call is applied

var inputOptions = [" > Show my Tweets", ` > Spotify a song`, ` > Movie Look-up`, ` > do-what-it-says`, ' > Exit']

var inputs = process.argv;

if (inputs.length == 2) {
    liriMenu();
}
else {
    var searchParam = "";

    switch (inputs[2]) {
        case "my-tweets":
            showTweets();
            break;
        case "spotify-this-song":
            if (inputs.length > 3) {
                for (var i = 3; i < inputs.length; i++) {
                    searchParam += inputs[i] + " ";
                }
            }
            spotifySong(searchParam);
            break;
        case "movie-this":

            if (inputs.length > 3) {
                for (var i = 3; i < inputs.length; i++) {
                    searchParam += inputs[i].toLowerCase();
                }
            }
            omdbRequest(searchParam);
            break;
        case "do-what-it-says":
            break;
    }
}



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
                break;
            case "Exit":
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

function spotifyMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What song would you like to spotify",
            name: "spotifyParam"
        }

        //could add input for track//artist//album

    ]).then(function (user) {
        // if (user.spotifyParam == "") {
        //     spotifySong("The sign ace of base");
        // }
        // else {
        spotifySong(user.spotifyParam);
        // }
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
            liriMenu();
        }
        else {
            console.log("-------------------------------------------------------------------");
            console.log("No song found.");
            console.log("-------------------------------------------------------------------");
        }
    });

}

function movieMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What movie would you like to search?",
            name: "movieParam"
        }

        //could add input for track//artist//album

    ]).then(function (user) {

        omdbRequest(user.movieParam);

    });
}

function omdbRequest(movie) {

    //  * Title of the movie.
    //    * Year the movie came out.
    //    * IMDB Rating of the movie.
    //    * Country where the movie was produced.
    //    * Language of the movie.
    //    * Plot of the movie.
    //    * Actors in the movie.
    //    * Rotten Tomatoes Rating.
    //    * Rotten Tomatoes URL.

    var movieRequest = "mr.nobody";


    // need a bad request handler
    if (movie != "") {
        movieRequest = movie;
    }

    console.log(movieRequest);

    var url = "http://www.omdbapi.com/?t=" + movieRequest + "&y=&plot=short&r=json";

    request(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // console.log(body);
            // console.log(url);
            // console.log(response);
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
            // console.log("Rotten Tomatoes Link: ", JSON.parse(body).Released);

            console.log("-------------------------------------------------------------------");
            // console.log(index);
            // console.log(movieObj);
            liriMenu();
        }
    });
}