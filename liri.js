var keys = require("./keys.js");
var inquirer = require("inquirer");
var twitter = require("twitter");
var inputOptions = ["my-tweets", `spotify-this-song`, `movie-this`, `do-what-it-says`,'Exit']


liriMenu();

function liriMenu() {
    inquirer.prompt([
        {
            type:"list",
            message:"What would you like to do today?",
            choices:inputOptions,
            name:"start"
        }


    ]).then(function (user) {

        switch (user.start) {

            case "my-tweets":
                showTweets();
                break;
            case "spotify-this-song":
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
                console.log("Tweet: ",tweets[i].text);
            }

        }
        liriMenu();
    });
}