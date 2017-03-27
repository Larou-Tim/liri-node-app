var keys = require("./keys.js");
var inquirer = require("inquirer");
var twitter = require("twitter");
var spotify = require('spotify');
var request = require("request");

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
                movieMenu();
                break;
            case "do-what-it-says":
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


function movieMenu() {
    inquirer.prompt([
        {
            type: "input",
            message: "What movie would you like to search?",
            name: "movieParam"
        }

        //could add input for track//artist//album

    ]).then(function (user) {
        if (user.movieParam == "") {
            omdbRequest("mr.nobody");
        }
        else {
            omdbRequest(user.movieParam);
        }
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


// need a bad request handler

    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json";

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
            console.log("Rotten Tomatoes Rating: ", JSON.parse(body).Ratings[1].Value);
            // console.log("Rotten Tomatoes Link: ", JSON.parse(body).Released);

            console.log("-------------------------------------------------------------------");
            // console.log(index);
            // console.log(movieObj);
            liriMenu();
        }
    });
}